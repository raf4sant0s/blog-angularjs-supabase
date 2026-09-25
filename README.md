# Pauta — Blog com AngularJS, Bootstrap, Node.js e Supabase

Blog de notícias no estilo da [api-fake-blog](https://github.com/profdiegocandido/api-fake-blog) e do
[front-blog-angularjs](https://github.com/profdiegocandido/front-blog-angularjs), agora com banco de dados de verdade,
login e interação.

**👉 Para rodar, siga o [PASSO-A-PASSO.md](PASSO-A-PASSO.md).**

## Funcionalidades

- Lista de postagens com destaque, filtro por categoria e busca
- **Ler mais**: página completa da postagem
- **Autenticação**: cadastro, login e logout
- **Esqueci minha senha**: e-mail com link + página para criar nova senha
- **Curtir** / descurtir postagens (1 curtida por usuário)
- **Comentários**: listar, comentar e apagar o próprio comentário

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Front-end | AngularJS 1.8 (+ ngRoute), Bootstrap 5.3, Bootstrap Icons |
| API | Node.js, Express |
| Banco e autenticação | Supabase (PostgreSQL + Supabase Auth) |

## Estrutura

```
blog-angularjs-supabase/
├── api/                    → API REST (Express)
│   ├── app.js              → servidor; também serve a pasta front/
│   ├── .env.example        → modelo das chaves do Supabase
│   └── src/
│       ├── supabase.js     → conexão com o Supabase
│       ├── auth-middleware.js → valida o token do usuário
│       └── routes/
│           ├── auth.js     → cadastro, login, esqueci/redefinir senha
│           └── posts.js    → postagens, curtir, comentários
├── front/                  → site em AngularJS + Bootstrap
│   ├── index.html          → página principal (ng-view)
│   ├── redefinir-senha.html→ página do link do e-mail
│   ├── css/style.css       → tema visual
│   ├── js/                 → app (rotas), services, filters, controllers
│   └── views/              → home, post, login, cadastro, esqueci-senha
└── supabase/
    ├── schema.sql          → cria as tabelas
    └── seed.sql            → postagens iniciais
```

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/postagens` | Lista todas as postagens (com nº de curtidas e comentários) |
| GET | `/postagem/:id` | Uma postagem completa ("ler mais") |
| POST | `/postagem/:id/curtir` | Curte / descurte (login) |
| GET | `/postagem/:id/comentarios` | Comentários da postagem |
| POST | `/postagem/:id/comentarios` | Novo comentário (login) |
| DELETE | `/comentarios/:id` | Apaga o próprio comentário (login) |
| POST | `/auth/cadastro` | Cria conta |
| POST | `/auth/login` | Entra e recebe o token |
| POST | `/auth/esqueci-senha` | Envia e-mail de recuperação |
| POST | `/auth/redefinir-senha` | Salva a nova senha |
| GET | `/auth/me` | Dados do usuário logado |

Os campos das postagens seguem os nomes da API do professor (`title`, `description`, `thumbImage`,
`profileName`, `postDate`...), com `content`, `category`, `curtidas`, `comentarios` e `curtidoPorMim` a mais.

## Diferenças em relação ao código original do professor

- `.success()` foi removido do AngularJS 1.6+; aqui usamos `.then()` (AngularJS 1.8.3).
- A rota `/categoria/games` do original usava uma variável que não existia (`catgames`); aqui o filtro é `?categoria=`.
- As postagens ficam no Supabase em vez de um array fixo no código.
