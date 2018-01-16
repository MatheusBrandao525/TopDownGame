var TopDownGame = TopDownGame || {};

var proManager = function() {};

var fireBoltFrames = Phaser.Animation.generateFrameNames('fireBolt', 0, 7);


proManager.prototype = {
  spells: new Array(),
  init: function(game) {
    this.spells = game.add.group();
  },
  newSpell: function(game, player, sprite, mouse){
    let spell = this.spells.create(player.x, player.y, sprite);

    let tAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(player.x, player.y, mouse.x, mouse.y) + 90;
    if(tAngle < 0) tAngle += 360;

    spell.angle = tAngle;
    spell.anchor.setTo(0.5);
    game.physics.arcade.enable(spell);
    spell.width = 32;
    spell.height = 32;
    spell.autocull = true;
    spell.animations.add('fly', fireBoltFrames, 15, true);
    spell.animations.play('fly');
    game.physics.arcade.velocityFromAngle(spell.angle - 90, 200, spell.body.velocity);
  },
  update: function () {
    
  }
};
