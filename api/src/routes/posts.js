const express = require('express')
const { admin } = require('../supabase')
const { autenticacaoOpcional, autenticacaoObrigatoria, usuarioPublico } = require('../auth-middleware')

const router = express.Router()
const CAMPOS = '*, likes(count), comments(count)'

// Converte do banco (snake_case) para o formato da api-fake-blog do professor (camelCase)
function formatarPost(p, curtidos) {
    return {
        id: p.id,
        title: p.title,
        description: p.description,
        content: p.content,
        thumbImage: p.thumb_image,
        thumbImageAltText: p.thumb_image_alt,
        category: p.category,
        profileName: p.profile_name,
        profileThumbImage: p.profile_thumb_image,
        postDate: p.post_date,
        curtidas: p.likes[0] ? p.likes[0].count : 0,
        comentarios: p.comments[0] ? p.comments[0].count : 0,
        curtidoPorMim: curtidos.has(p.id)
    }
}

async function postsCurtidosPor(user) {
    if (!user) return new Set()
    const { data } = await admin.from('likes').select('post_id').eq('user_id', user.id)
    return new Set((data || []).map((l) => l.post_id))
}

async function contarCurtidas(postId) {
    const { count } = await admin.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', postId)
    return count || 0
}

// LISTAR TODAS AS POSTAGENS
router.get('/postagens', autenticacaoOpcional, async (req, res) => {
    let consulta = admin.from('posts').select(CAMPOS).order('post_date', { ascending: false }).order('id')
    if (req.query.categoria) consulta = consulta.eq('category', req.query.categoria)

    const { data, error } = await consulta
    if (error) return res.status(500).json({ erro: error.message })

    const curtidos = await postsCurtidosPor(req.user)
    res.json(data.map((p) => formatarPost(p, curtidos)))
})

// LER MAIS: UMA POSTAGEM
router.get('/postagem/:id', autenticacaoOpcional, async (req, res) => {
    const { data, error } = await admin.from('posts').select(CAMPOS).eq('id', req.params.id).maybeSingle()
    if (error) return res.status(500).json({ erro: error.message })
    if (!data) return res.status(404).json({ erro: 'Postagem não encontrada.' })

    const curtidos = await postsCurtidosPor(req.user)
    res.json(formatarPost(data, curtidos))
})

// CURTIR / DESCURTIR (toggle)
router.post('/postagem/:id/curtir', autenticacaoObrigatoria, async (req, res) => {
    const postId = Number(req.params.id)
    const { data: existe } = await admin.from('likes')
        .select('post_id').eq('post_id', postId).eq('user_id', req.user.id).maybeSingle()

    const { error } = existe
        ? await admin.from('likes').delete().eq('post_id', postId).eq('user_id', req.user.id)
        : await admin.from('likes').insert({ post_id: postId, user_id: req.user.id })

    if (error) {
        const status = error.code === '23503' ? 404 : 500 // 23503 = post não existe
        return res.status(status).json({ erro: status === 404 ? 'Postagem não encontrada.' : error.message })
    }
    res.json({ curtido: !existe, curtidas: await contarCurtidas(postId) })
})

// LISTAR COMENTÁRIOS DE UMA POSTAGEM
router.get('/postagem/:id/comentarios', async (req, res) => {
    const { data, error } = await admin.from('comments')
        .select('id, user_id, author_name, body, created_at')
        .eq('post_id', req.params.id)
        .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ erro: error.message })

    res.json(data.map((c) => ({
        id: c.id, userId: c.user_id, autor: c.author_name, texto: c.body, criadoEm: c.created_at
    })))
})

// COMENTAR
router.post('/postagem/:id/comentarios', autenticacaoObrigatoria, async (req, res) => {
    const texto = (req.body.texto || '').trim()
    if (!texto) return res.status(400).json({ erro: 'Escreva algo antes de enviar.' })
    if (texto.length > 1000) return res.status(400).json({ erro: 'O comentário pode ter no máximo 1000 caracteres.' })

    const autor = usuarioPublico(req.user).nome
    const { data, error } = await admin.from('comments')
        .insert({ post_id: Number(req.params.id), user_id: req.user.id, author_name: autor, body: texto })
        .select().single()
    if (error) {
        const status = error.code === '23503' ? 404 : 500
        return res.status(status).json({ erro: status === 404 ? 'Postagem não encontrada.' : error.message })
    }
    res.status(201).json({ id: data.id, userId: data.user_id, autor: data.author_name, texto: data.body, criadoEm: data.created_at })
})

// APAGAR O PRÓPRIO COMENTÁRIO
router.delete('/comentarios/:id', autenticacaoObrigatoria, async (req, res) => {
    const { data, error } = await admin.from('comments')
        .delete().eq('id', req.params.id).eq('user_id', req.user.id).select()
    if (error) return res.status(500).json({ erro: error.message })
    if (!data.length) return res.status(404).json({ erro: 'Comentário não encontrado.' })
    res.status(204).end()
})

module.exports = router
