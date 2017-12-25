var TopDownGame = TopDownGame || {};

TopDownGame.game = new Phaser.Game(600, 350, Phaser.AUTO, '');



TopDownGame.game.state.add('Boot', TopDownGame.Boot);
TopDownGame.game.state.add('Preload', TopDownGame.Preload);
TopDownGame.game.state.add('Game', TopDownGame.Game);

TopDownGame.game.state.start('Boot');

TopDownGame.player = new playerObj();
