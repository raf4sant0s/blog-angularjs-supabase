# Passo a passo: fazer o blog funcionar

A ordem importa: **primeiro o Supabase, depois a API, por último abrir o site.**

---

## 1. Criar o projeto no Supabase (≈ 5 min)

1. Entre em https://supabase.com e faça login (pode usar o GitHub).
2. Clique em **New project**.
   - Name: `blog-pauta` (ou o nome que quiser)
   - Database Password: invente uma e **anote**
   - Region: **South America (São Paulo)**
3. Espere uns 2 minutos até o projeto ficar pronto.

## 2. Criar as tabelas

1. No menu da esquerda, abra **SQL Editor** → **New query**.
2. Abra o arquivo `supabase/schema.sql` no VS Code, copie tudo, cole no editor e clique em **Run**.
   - Isso cria as tabelas `posts`, `comments` e `likes`.
3. Faça uma nova query com o conteúdo de `supabase/seed.sql` e clique em **Run**.
   - Isso cria as 6 postagens iniciais (as mesmas do repositório do professor, com texto completo).
4. Confira em **Table Editor** → `posts`: devem aparecer 6 linhas.

## 3. Configurar a autenticação

1. Vá em **Authentication** → **URL Configuration**.
2. Em **Site URL** coloque: `http://localhost:3000`
3. Em **Redirect URLs** clique em **Add URL** e adicione: `http://localhost:3000/redefinir-senha.html`
4. Salve.

> O e-mail/senha já vem ligado por padrão (Authentication → Sign In / Providers → Email).
> O cadastro do blog já cria o usuário confirmado, então **não precisa** confirmar e-mail para entrar.

## 4. Pegar as chaves

1. Vá em **Project Settings** (engrenagem) → **API** (ou **API Keys**).
2. Você vai precisar de 3 coisas:
   - **Project URL** (ex.: `https://abcdefgh.supabase.co`)
   - **anon public** key
   - **service_role** key (clique em *Reveal*)

> ⚠️ A `service_role` é secreta: ela só vai no `.env` da API. **Nunca** coloque no front nem suba para o GitHub
> (o `.gitignore` já impede o `.env` de subir).

## 5. Rodar a API

No VS Code, abra a pasta `blog-angularjs-supabase` e um terminal (Ctrl + ').

```bash
cd api
copy .env.example .env
npm install
npm start
```

Abra o arquivo `api/.env` e cole os valores do passo 4:

```
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
PORT=3000
FRONT_URL=http://localhost:3000
```

Salve e rode `npm start` de novo. Deve aparecer: `Blog rodando em http://localhost:3000`.

## 6. Abrir o blog

Abra **http://localhost:3000** no navegador. A própria API já serve o front-end.

Teste nesta ordem:
1. A home mostra as 6 postagens ✔
2. Clique em uma → **Ler mais** abre o texto completo ✔
3. **Criar conta** → você entra logado ✔
4. Clique no ❤️ para **curtir** (clique de novo para descurtir) ✔
5. Escreva um **comentário** e apague ✔
6. Saia, vá em **Entrar → Esqueci minha senha**, digite seu e-mail e abra o link que chegar ✔

> 📧 O Supabase gratuito envia **poucos e-mails por hora** (limite de ~2–4). Se o "esqueci minha senha"
> não chegar, espere um pouco, olhe o spam, ou veja o envio em **Authentication → Users**.

---

## Testar a API pelo Thunder Client / Insomnia / Postman (opcional)

| Método | Rota | Precisa login? | Corpo (JSON) |
|---|---|---|---|
| GET | `/postagens` | não | — |
| GET | `/postagem/1` | não | — |
| POST | `/auth/cadastro` | não | `{ "nome": "Ana", "email": "ana@email.com", "senha": "123456" }` |
| POST | `/auth/login` | não | `{ "email": "ana@email.com", "senha": "123456" }` |
| POST | `/auth/esqueci-senha` | não | `{ "email": "ana@email.com" }` |
| POST | `/auth/redefinir-senha` | não | `{ "token": "<do link do e-mail>", "senha": "nova123" }` |
| GET | `/auth/me` | **sim** | — |
| POST | `/postagem/1/curtir` | **sim** | — |
| GET | `/postagem/1/comentarios` | não | — |
| POST | `/postagem/1/comentarios` | **sim** | `{ "texto": "Muito bom!" }` |
| DELETE | `/comentarios/5` | **sim** (só o autor) | — |

"Precisa login" = mandar o header `Authorization: Bearer <token>` (o `token` vem da resposta do login).

---

## (Opcional) Publicar na internet

Se o professor pedir o link online, dá para publicar a API no **Render** (igual à api-fake-blog dele):

1. Suba a pasta para um repositório no GitHub.
2. No Render: **New → Web Service** → escolha o repositório.
   - Root Directory: `api` · Build: `npm install` · Start: `npm start`
   - Em **Environment**, cadastre as mesmas variáveis do `.env`, trocando `FRONT_URL` pelo endereço do Render.
3. Troque `http://localhost:3000` pelo endereço do Render em `front/js/app.js` e `front/redefinir-senha.html`.
4. No Supabase, adicione o novo endereço em **Site URL** / **Redirect URLs** (passo 3).

## Problemas comuns

| Erro | Solução |
|---|---|
| `Faltam variáveis do Supabase` | O arquivo `api/.env` não existe ou está vazio (passo 5). |
| "Não foi possível falar com a API" | A API não está rodando. Rode `npm start` dentro de `api`. |
| Home vazia / erro 500 | Rodou o `schema.sql` e o `seed.sql`? (passo 2) |
| `Invalid API key` | Chave copiada errada ou com espaço no final. |
| Link do e-mail abre página errada | Confira as URLs do passo 3. |
| `EADDRINUSE: 3000` | Já tem algo na porta 3000. Feche o outro terminal ou mude `PORT`. |
