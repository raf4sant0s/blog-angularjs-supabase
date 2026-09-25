const { createClient } = require('@supabase/supabase-js')

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('\n[ERRO] Faltam variáveis do Supabase no arquivo api/.env')
    console.error('       Copie api/.env.example para api/.env e preencha (veja PASSO-A-PASSO.md).\n')
    process.exit(1)
}

const opcoes = { auth: { persistSession: false, autoRefreshToken: false } }

// Cliente "admin": usa a service_role key, ignora o RLS. Só existe aqui no servidor.
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, opcoes)

// Cliente público (anon key) para login / recuperação de senha.
// Criamos um novo a cada requisição para a sessão de um usuário não "vazar" para outro.
function clientePublico() {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, opcoes)
}

module.exports = { admin, clientePublico }
