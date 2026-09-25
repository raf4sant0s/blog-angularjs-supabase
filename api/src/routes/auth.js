const express = require('express')
const { admin, clientePublico } = require('../supabase')
const { autenticacaoObrigatoria, usuarioPublico } = require('../auth-middleware')

const router = express.Router()
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')

async function entrar(email, senha) {
    const { data, error } = await clientePublico().auth.signInWithPassword({ email, password: senha })
    if (error) return null
    return { token: data.session.access_token, usuario: usuarioPublico(data.user) }
}

// CADASTRO
router.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body
    if (!nome || !nome.trim()) return res.status(400).json({ erro: 'Informe seu nome.' })
    if (!emailValido(email)) return res.status(400).json({ erro: 'E-mail inválido.' })
    if (!senha || senha.length < 6) return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' })

    // email_confirm: true -> não precisa confirmar o e-mail para usar o blog
    const { error } = await admin.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        user_metadata: { nome: nome.trim() }
    })
    if (error) {
        const jaExiste = /already|registered|exists/i.test(error.message)
        return res.status(jaExiste ? 409 : 400).json({
            erro: jaExiste ? 'Já existe uma conta com esse e-mail.' : error.message
        })
    }

    const sessao = await entrar(email, senha)
    res.status(201).json(sessao)
})

// LOGIN
router.post('/login', async (req, res) => {
    const { email, senha } = req.body
    if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha.' })

    const sessao = await entrar(email, senha)
    if (!sessao) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
    res.json(sessao)
})

// ESQUECI MINHA SENHA -> o Supabase envia um e-mail com o link de redefinição
router.post('/esqueci-senha', async (req, res) => {
    const { email } = req.body
    if (!emailValido(email)) return res.status(400).json({ erro: 'E-mail inválido.' })

    const redirectTo = (process.env.FRONT_URL || 'http://localhost:3000') + '/redefinir-senha.html'
    const { error } = await clientePublico().auth.resetPasswordForEmail(email, { redirectTo })
    if (error && error.status === 429) {
        return res.status(429).json({ erro: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' })
    }
    // Resposta sempre igual, para não revelar quais e-mails têm conta
    res.json({ mensagem: 'Se o e-mail estiver cadastrado, você vai receber um link para criar uma nova senha.' })
})

// REDEFINIR SENHA (recebe o token que veio no link do e-mail)
router.post('/redefinir-senha', async (req, res) => {
    const { token, senha } = req.body
    if (!token) return res.status(400).json({ erro: 'Link inválido ou expirado.' })
    if (!senha || senha.length < 6) return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' })

    const { data, error } = await admin.auth.getUser(token)
    if (error || !data.user) return res.status(401).json({ erro: 'Link inválido ou expirado. Peça um novo.' })

    const { error: erroUpdate } = await admin.auth.admin.updateUserById(data.user.id, { password: senha })
    if (erroUpdate) return res.status(400).json({ erro: erroUpdate.message })
    res.json({ mensagem: 'Senha alterada! Já pode entrar com a nova senha.' })
})

// QUEM SOU EU
router.get('/me', autenticacaoObrigatoria, (req, res) => {
    res.json(usuarioPublico(req.user))
})

module.exports = router
