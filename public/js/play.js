// Cria um namespace para o jogo se ele não existir
var TopDownGame = TopDownGame || {};

// Define a fase de inicialização do jogo.
TopDownGame.Boot = function() {};

// Define o protótipo de Boot, que contém as funções do ciclo de vida da fase.
TopDownGame.Boot.prototype = {
  // Função `preload` é chamada primeiro e serve para carregar os assets necessários nesta fase
  preload: function() {
    // Carrega uma imagem que será usada como barra de progresso do pré-carregamento
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },

  // Função `create` é chamada após o `preload` para configurar o ambiente do jogo
  create: function () {
    // Configura a cor de fundo do estágio do jogo
    this.game.stage.backgroundColor = "#222";

    // Configura o modo de escala para mostrar todo o jogo enquanto mantém a proporção original
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Alinha a página horizontalmente de forma centralizada
    this.scale.pageAlignHorizontally = true;

    // Alinha a página verticalmente de forma centralizada
    this.scale.pageAlignVertically = true;

    // Inicia o sistema de física ARCADE, um dos sistemas de física fornecidos pelo Phaser
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Inicia a próxima fase, neste caso 'Preload'
    this.state.start('Preload');
  }
};
