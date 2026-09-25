angular.module('blog')

    // Barra de navegação (usuário logado, sair)
    .controller('NavCtrl', function ($scope, $location, Auth, Toast) {
        $scope.auth = Auth
        $scope.rotaAtual = function (rota) { return $location.path() === rota && !$location.search().categoria }
        $scope.sair = function () {
            Auth.sair()
            Toast.ok('Você saiu da sua conta.')
            $location.path('/')
        }
    })

    // HOME: lista de postagens
    .controller('HomeCtrl', function ($scope, $location, Api, Auth, Toast) {
        $scope.carregando = true
        $scope.publicacoes = []
        $scope.busca = ''
        $scope.categoria = $location.search().categoria || ''

        Api.postagens().then(function (lista) {
            $scope.publicacoes = lista
            $scope.categorias = lista.map(function (p) { return p.category })
                .filter(function (c, i, todas) { return c && todas.indexOf(c) === i })
        }).catch(function (r) {
            $scope.erro = true
            Toast.erro(r, 'Não foi possível carregar as postagens.')
        }).finally(function () { $scope.carregando = false })

        $scope.filtrar = function (cat) {
            $scope.categoria = cat
            $location.search('categoria', cat || null)
        }
        $scope.$on('$routeUpdate', function () { $scope.categoria = $location.search().categoria || '' })

        $scope.filtrados = function () {
            var termo = $scope.busca.toLowerCase()
            return $scope.publicacoes.filter(function (p) {
                return (!$scope.categoria || p.category === $scope.categoria) &&
                    (!termo || (p.title + ' ' + p.description).toLowerCase().indexOf(termo) !== -1)
            })
        }

        // Destaque = primeira postagem, só quando não tem filtro
        $scope.mostrarDestaque = function () { return !$scope.categoria && !$scope.busca && $scope.publicacoes.length }

        $scope.curtir = function (post, $event) {
            $event.preventDefault(); $event.stopPropagation()
            if (!Auth.logado()) { Toast.erro(null, 'Entre na sua conta para curtir.'); return $location.path('/login') }
            Api.curtir(post.id).then(function (r) {
                post.curtidoPorMim = r.curtido
                post.curtidas = r.curtidas
            }).catch(function (r) { Toast.erro(r) })
        }
    })

    // LER MAIS: postagem completa + curtir + comentários
    .controller('PostCtrl', function ($scope, $routeParams, $location, $window, Api, Auth, Toast) {
        var id = $routeParams.id
        $scope.auth = Auth
        $scope.carregando = true
        $scope.novo = { texto: '' }

        Api.postagem(id).then(function (post) {
            $scope.post = post
        }).catch(function (r) {
            $scope.naoEncontrado = true
            Toast.erro(r, 'Postagem não encontrada.')
        }).finally(function () { $scope.carregando = false })

        Api.comentarios(id).then(function (lista) { $scope.comentarios = lista })

        $scope.curtir = function () {
            if (!Auth.logado()) { Toast.erro(null, 'Entre na sua conta para curtir.'); return $location.path('/login') }
            $scope.animarCurtida = !$scope.post.curtidoPorMim
            Api.curtir(id).then(function (r) {
                $scope.post.curtidoPorMim = r.curtido
                $scope.post.curtidas = r.curtidas
            }).catch(function (r) { Toast.erro(r) })
        }

        $scope.comentar = function () {
            if (!$scope.novo.texto.trim()) return
            $scope.enviando = true
            Api.comentar(id, $scope.novo.texto).then(function (c) {
                $scope.comentarios.unshift(c)
                $scope.post.comentarios++
                $scope.novo.texto = ''
                Toast.ok('Comentário publicado!')
            }).catch(function (r) { Toast.erro(r) })
                .finally(function () { $scope.enviando = false })
        }

        $scope.apagar = function (c) {
            if (!$window.confirm('Apagar este comentário?')) return
            Api.apagarComentario(c.id).then(function () {
                $scope.comentarios.splice($scope.comentarios.indexOf(c), 1)
                $scope.post.comentarios--
            }).catch(function (r) { Toast.erro(r) })
        }

        $scope.copiarLink = function () {
            $window.navigator.clipboard.writeText($window.location.href)
            Toast.ok('Link copiado!')
        }
    })

    // LOGIN
    .controller('LoginCtrl', function ($scope, $location, Api, Auth, Toast) {
        $scope.form = {}
        $scope.entrar = function () {
            $scope.enviando = true
            Api.login($scope.form.email, $scope.form.senha).then(function (sessao) {
                Auth.salvar(sessao)
                Toast.ok('Bem-vindo(a) de volta, ' + sessao.usuario.nome.split(' ')[0] + '!')
                $location.path('/')
            }).catch(function (r) { Toast.erro(r) })
                .finally(function () { $scope.enviando = false })
        }
    })

    // CADASTRO
    .controller('CadastroCtrl', function ($scope, $location, Api, Auth, Toast) {
        $scope.form = {}
        $scope.cadastrar = function () {
            $scope.enviando = true
            Api.cadastro($scope.form.nome, $scope.form.email, $scope.form.senha).then(function (sessao) {
                Auth.salvar(sessao)
                Toast.ok('Conta criada! Bem-vindo(a) ao Pauta.')
                $location.path('/')
            }).catch(function (r) { Toast.erro(r) })
                .finally(function () { $scope.enviando = false })
        }
    })

    // ESQUECI MINHA SENHA
    .controller('EsqueciSenhaCtrl', function ($scope, Api, Toast) {
        $scope.form = {}
        $scope.enviar = function () {
            $scope.enviando = true
            Api.esqueciSenha($scope.form.email).then(function (r) {
                $scope.enviado = r.mensagem
            }).catch(function (r) { Toast.erro(r) })
                .finally(function () { $scope.enviando = false })
        }
    })
