const { admin } = require('./supabase')

// Lê o token "Authorization: Bearer <token>" e, se for válido, coloca o usuário em req.user
async function autenticacaoOpcional(req, res, next) {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return next()

    const { data, error } = await admin.auth.getUser(token)
    if (!error && data.user) req.user = data.user
    next()
}

// Mesma coisa, mas bloqueia quem não está logado
function autenticacaoObrigatoria(req, res, next) {
    autenticacaoOpcional(req, res, () => {
        if (!req.user) return res.status(401).json({ erro: 'Faça login para continuar.' })
        next()
    })
}

function usuarioPublico(user) {
    return {
        id: user.id,
        email: user.email,
        nome: (user.user_metadata && user.user_metadata.nome) || user.email.split('@')[0]
    }
}

module.exports = { autenticacaoOpcional, autenticacaoObrigatoria, usuarioPublico }
