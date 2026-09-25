angular.module('blog', ['ngRoute'])

    // Endereço da API. Se a API estiver publicada (ex.: Render), troque aqui.
    .constant('API_URL', 'http://localhost:3000')

    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', { templateUrl: 'views/home.html', controller: 'HomeCtrl', reloadOnSearch: false })
            .when('/post/:id', { templateUrl: 'views/post.html', controller: 'PostCtrl' })
            .when('/login', { templateUrl: 'views/login.html', controller: 'LoginCtrl' })
            .when('/cadastro', { templateUrl: 'views/cadastro.html', controller: 'CadastroCtrl' })
            .when('/esqueci-senha', { templateUrl: 'views/esqueci-senha.html', controller: 'EsqueciSenhaCtrl' })
            .otherwise({ redirectTo: '/' })

        $httpProvider.interceptors.push('authInterceptor')
    })

    // Sempre volta ao topo ao trocar de tela
    .run(function ($rootScope, $window) {
        $rootScope.$on('$routeChangeSuccess', function () { $window.scrollTo(0, 0) })
    })
