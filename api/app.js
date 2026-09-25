require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')

const rotasAuth = require('./src/routes/auth')
const rotasPosts = require('./src/routes/posts')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use((req, res, next) => { req.body = req.body || {}; next() })

app.use('/auth', rotasAuth)
app.use('/', rotasPosts)

// Serve o front-end (pasta ../front) no mesmo endereço: http://localhost:3000
app.use(express.static(path.join(__dirname, '..', 'front')))

// Qualquer erro inesperado (ex.: sem internet para falar com o Supabase)
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
})

app.listen(port, () => console.log(`Blog rodando em http://localhost:${port}`))
