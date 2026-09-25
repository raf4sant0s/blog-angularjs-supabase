angular.module('blog')

    // "Maria Silva" -> "MS"
    .filter('iniciais', function () {
        return function (nome) {
            if (!nome) return '?'
            var partes = nome.trim().split(/\s+/)
            return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase()
        }
    })

    // Cor fixa para cada nome (avatar de iniciais)
    .filter('corAvatar', function () {
        var cores = ['#e2553a', '#2f6f5e', '#3b5bdb', '#b7791f', '#9c36b5', '#0c8599', '#c2255c']
        return function (nome) {
            var soma = 0
            for (var i = 0; i < (nome || '').length; i++) soma += nome.charCodeAt(i)
            return cores[soma % cores.length]
        }
    })

    // Quebra o texto completo em parágrafos
    .filter('paragrafos', function () {
        return function (texto) {
            return (texto || '').split(/\n\s*\n/).filter(function (p) { return p.trim() })
        }
    })

    // Tempo estimado de leitura
    .filter('tempoLeitura', function () {
        return function (texto) {
            var palavras = (texto || '').split(/\s+/).length
            return Math.max(1, Math.round(palavras / 200)) + ' min de leitura'
        }
    })

    // "2022-06-10" -> "10 de jun. de 2022"
    .filter('dataBr', function () {
        return function (data) {
            if (!data) return ''
            var d = new Date(data.length === 10 ? data + 'T12:00:00' : data)
            return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
        }
    })

    // "há 5 min", "há 2 dias"...
    .filter('tempoAtras', function () {
        return function (data) {
            var seg = Math.floor((Date.now() - new Date(data).getTime()) / 1000)
            if (seg < 60) return 'agora mesmo'
            var min = Math.floor(seg / 60); if (min < 60) return 'há ' + min + ' min'
            var h = Math.floor(min / 60); if (h < 24) return 'há ' + h + 'h'
            var dias = Math.floor(h / 24); if (dias < 30) return 'há ' + dias + (dias === 1 ? ' dia' : ' dias')
            return new Date(data).toLocaleDateString('pt-BR')
        }
    })
