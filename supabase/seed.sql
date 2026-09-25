-- =============================================================
--  Postagens iniciais (baseadas nas da api-fake-blog do professor)
--  Rodar DEPOIS do schema.sql
-- =============================================================

insert into public.posts
  (title, description, content, thumb_image, thumb_image_alt, category, profile_name, profile_thumb_image, post_date)
values
(
  'Google Notícias completa 20 anos com redesign e fundo de apoio ao jornalismo independente',
  'O Google apresentou uma nova versão para desktop do seu serviço de notícias, prometendo mais profundidade e facilidade de acesso aos temas que os usuários acompanham.',
  'Na última semana, o Google apresentou uma nova versão para desktop do seu serviço de notícias. Depois de um redesign profundo, a plataforma promete informar mais sobre os temas que cada pessoa acompanha, com mais contexto e menos ruído.

A nova página inicial organiza as manchetes em blocos: destaques do dia, notícias locais e uma seção personalizada chamada "Para você". A ideia é que o leitor encontre rapidamente o que importa, seja no computador ou no celular.

Junto com o novo visual, a empresa anunciou um fundo de apoio ao jornalismo independente. O dinheiro deve ser distribuído para pequenas redações, com foco em veículos regionais que cobrem assuntos pouco vistos pela grande mídia.

Especialistas lembram que a relação entre plataformas e imprensa ainda é delicada: ao mesmo tempo em que o Google leva audiência aos sites, ele também concentra boa parte da publicidade digital. O aniversário de 20 anos chega, portanto, com celebração e com cobrança.',
  'https://picsum.photos/seed/pauta-google/1200/800', 'Tela de computador com notícias', 'Tecnologia',
  'Fernando Silva', 'https://i.pravatar.cc/150?img=12', '2022-03-01'
),
(
  'Vendas do Macbook com chip M2 começam nesta sexta-feira',
  'Durante a WWDC, a Apple anunciou novidades em seus sistemas e produtos, incluindo um Macbook Air redesenhado com a segunda geração de chips da empresa.',
  'Durante a WWDC deste ano, a Apple anunciou diversas novidades em seus sistemas e produtos. O destaque ficou para o Macbook Air redesenhado, que chega equipado com o M2, a segunda geração de chips criados pela própria empresa.

Segundo a Apple, o M2 entrega CPU até 18% mais rápida e GPU até 35% mais potente que o M1, mantendo o consumo de energia baixo. Na prática, isso significa bateria para um dia inteiro de uso e nenhuma ventoinha fazendo barulho.

O novo design é mais fino, com bordas retas, tela maior e câmera melhor para videochamadas. O carregador MagSafe também voltou, uma reclamação antiga dos usuários.

As vendas começam nesta sexta-feira nos Estados Unidos. No Brasil, a previsão é que o modelo chegue nas próximas semanas, com preço ainda não confirmado.',
  'https://picsum.photos/seed/pauta-macbook/1200/800', 'Notebook aberto sobre a mesa', 'Tecnologia',
  'Paula Ramos', 'https://i.pravatar.cc/150?img=47', '2022-06-24'
),
(
  'Citroën Ami Buggy: o carro mais simpático que você já viu',
  '17 minutos para esgotar e apenas 2 minutos e 53 segundos para vender a primeira unidade. Estes são os números das 50 unidades ultra limitadas do My Ami Buggy.',
  '17 minutos para esgotar e apenas 2 minutos e 53 segundos para vender a primeira unidade. Esses são os números (incríveis) das vendas das 50 unidades especiais e ultra limitadas do My Ami Buggy, da Citroën.

O Ami é um microcarro elétrico de dois lugares pensado para a cidade. A versão Buggy troca as portas por aberturas em tubo, ganha teto removível e rodas maiores, com um visual que lembra os bugues de praia.

Com velocidade máxima de 45 km/h e autonomia de cerca de 75 km, ele não foi feito para estrada, mas para trajetos curtos. Em alguns países europeus, pode até ser dirigido por adolescentes a partir de 14 anos.

O sucesso das vendas mostra que existe público para carros pequenos, divertidos e baratos de manter, principalmente nas grandes cidades.',
  'https://picsum.photos/seed/pauta-buggy/1200/800', 'Carro pequeno estacionado na rua', 'Carros',
  'Rodrigo Silveira', 'https://i.pravatar.cc/150?img=33', '2022-03-01'
),
(
  'SEGA anuncia Hyenas, novo FPS no espaço pós-apocalíptico',
  'O mundo dos jogos competitivos nunca foi tão diverso, e o anúncio feito pela SEGA promete contribuir com mais um título promissor.',
  'O mundo dos jogos competitivos nunca foi tão diverso, e o anúncio feito pela SEGA nesta quarta-feira promete contribuir com mais um título promissor: Hyenas, um jogo de tiro em primeira pessoa ambientado no espaço.

Desenvolvido pela Creative Assembly, o mesmo estúdio da série Total War, o jogo coloca equipes de cinco jogadores para roubar itens raros de naves abandonadas, enquanto disputam o saque com outras equipes.

Um dos diferenciais é a gravidade zero: em várias áreas os jogadores flutuam, o que muda completamente a forma de se mover e mirar. O humor ácido e o visual colorido também chamaram a atenção no trailer.

A SEGA ainda não divulgou data de lançamento, mas já abriu inscrições para testes fechados no PC.',
  'https://picsum.photos/seed/pauta-games/1200/800', 'Controle de videogame iluminado', 'Games',
  'Lucas Oliveira', 'https://i.pravatar.cc/150?img=15', '2022-06-10'
),
(
  'Metaverso explode em discussões na internet, mas público ainda tem receios',
  'De acordo com números da Comscore, apenas 24% dos comentários na internet sobre o metaverso são positivos. O desconhecimento ainda desperta dúvidas.',
  'De acordo com números consolidados pela Comscore, apenas 24% dos comentários da internet sobre o metaverso são positivos. O motivo, segundo a pesquisa, seria o desconhecimento do público sobre o assunto, que ainda desperta dúvidas e receios.

As principais preocupações citadas são privacidade, preço dos equipamentos e o medo de passar tempo demais em ambientes virtuais. Muitas pessoas também não entendem a diferença entre metaverso, realidade virtual e jogos online.

Por outro lado, o volume de conversas cresceu muito: o termo foi mencionado milhões de vezes nas redes sociais no último ano, impulsionado por anúncios de grandes empresas de tecnologia.

Para os pesquisadores, o cenário é parecido com o início da internet: muita expectativa, pouca clareza e um longo caminho até que a tecnologia faça parte do dia a dia.',
  'https://picsum.photos/seed/pauta-metaverso/1200/800', 'Pessoa usando óculos de realidade virtual', 'Metaverso',
  'Maria Silva', 'https://i.pravatar.cc/150?img=45', '2022-06-10'
),
(
  'Como o metaverso e a web3 vão revolucionar a vida e os negócios?',
  'A ideia de criar mundos inteiramente fictícios e com possibilidades infinitas sempre encantou o ser humano — e agora move montanhas de dinheiro.',
  'A ideia de criar mundos inteiramente fictícios e com possibilidades infinitas sempre encantou o ser humano. Seja nas antigas tradições orais, na literatura, no cinema ou nos jogos, o desejo de materializar aquilo que só a imaginação consegue criar move montanhas, além de muito dinheiro.

A web3 propõe uma internet em que os usuários sejam donos dos seus dados e dos seus itens digitais, usando tecnologias como blockchain. Unida ao metaverso, ela permitiria, por exemplo, comprar uma roupa virtual e usá-la em diferentes plataformas.

Empresas já testam lojas, escritórios e salas de aula virtuais. Marcas de moda lançam coleções digitais e artistas fazem shows para milhares de avatares ao mesmo tempo.

Ainda há muitos desafios: equipamentos caros, consumo de energia e golpes envolvendo criptomoedas. Mas, para quem trabalha com inovação, ignorar essas mudanças pode sair caro.',
  'https://picsum.photos/seed/pauta-web3/1200/800', 'Luzes digitais em rede', 'Web3',
  'Débora Pacheco', 'https://i.pravatar.cc/150?img=32', '2022-06-10'
);
