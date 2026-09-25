angular.module('blog')

    // Guarda a sessão (token + usuário) no navegador
    .factory('Auth', function ($window, $rootScope) {
        var CHAVE = 'pauta.sessao'
        var sessao = null
        try { sessao = JSON.parse($window.localStorage.getItem(CHAVE)) } catch (e) { sessao = null }

        return {
            salvar: function (novaSessao) {
                sessao = novaSessao
                $window.localStorage.setItem(CHAVE, JSON.stringify(novaSessao))
                $rootScope.$broadcast('auth:mudou')
            },
            sair: function () {
                sessao = null
                $window.localStorage.removeItem(CHAVE)
                $rootScope.$broadcast('auth:mudou')
            },
            token: function () { return sessao && sessao.token },
            usuario: function () { return sessao && sessao.usuario },
            logado: function () { return !!(sessao && sessao.token) }
        }
    })

    // Coloca "Authorization: Bearer <token>" em toda chamada para a API
    .factory('authInterceptor', function ($q, $injector, API_URL) {
        return {
            request: function (config) {
                var Auth = $injector.get('Auth')
                if (Auth.token() && config.url.indexOf(API_URL) === 0) {
                    config.headers.Authorization = 'Bearer ' + Auth.token()
                }
                return config
            },
            responseError: function (resposta) {
                // Token vencido: desloga para a pessoa entrar de novo
                if (resposta.status === 401 && resposta.config.url.indexOf('/auth/') === -1) {
                    $injector.get('Auth').sair()
                }
                return $q.reject(resposta)
            }
        }
    })

    // Todas as rotas da API em um lugar só
    .factory('Api', function ($http, API_URL) {
        function dados(r) { return r.data }
        return {
            postagens: function () { return $http.get(API_URL + '/postagens').then(dados) },
            postagem: function (id) { return $http.get(API_URL + '/postagem/' + id).then(dados) },
            curtir: function (id) { return $http.post(API_URL + '/postagem/' + id + '/curtir').then(dados) },
            comentarios: function (id) { return $http.get(API_URL + '/postagem/' + id + '/comentarios').then(dados) },
            comentar: function (id, texto) { return $http.post(API_URL + '/postagem/' + id + '/comentarios', { texto: texto }).then(dados) },
            apagarComentario: function (id) { return $http.delete(API_URL + '/comentarios/' + id) },

            login: function (email, senha) { return $http.post(API_URL + '/auth/login', { email: email, senha: senha }).then(dados) },
            cadastro: function (nome, email, senha) { return $http.post(API_URL + '/auth/cadastro', { nome: nome, email: email, senha: senha }).then(dados) },
            esqueciSenha: function (email) { return $http.post(API_URL + '/auth/esqueci-senha', { email: email }).then(dados) },
            redefinirSenha: function (token, senha) { return $http.post(API_URL + '/auth/redefinir-senha', { token: token, senha: senha }).then(dados) }
        }
    })

    // Avisos que aparecem no canto da tela
    .factory('Toast', function ($rootScope, $timeout) {
        $rootScope.toasts = []
        function mostrar(texto, tipo) {
            var t = { texto: texto, tipo: tipo || 'ok' }
            $rootScope.toasts.push(t)
            $timeout(function () { $rootScope.toasts.splice($rootScope.toasts.indexOf(t), 1) }, 3500)
        }
        return {
            ok: function (texto) { mostrar(texto, 'ok') },
            erro: function (resposta, padrao) {
                var msg = (resposta && resposta.data && resposta.data.erro) ||
                    (resposta && resposta.status === -1 ? 'Não foi possível falar com a API. Ela está rodando?' : padrao || 'Algo deu errado.')
                mostrar(msg, 'erro')
            }
        }
    })
