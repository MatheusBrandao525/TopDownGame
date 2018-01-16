var TopDownGame = TopDownGame || {};
var gameSprites = new Array();

TopDownGame.Preload = function() {};

TopDownGame.Preload.prototype = {
  preload: function () {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3, 3);

    this.load.setPreloadSprite(this.preloadBar);

    //Load game assets here
    this.load.atlas('player', 'assets/gfx/hero.png', 'assets/gfx/hero.json');
    this.load.atlas('items', 'assets/gfx/items.png', 'assets/gfx/items.json');
    this.load.atlas('NPC', 'assets/gfx/NPC_test.png', 'assets/gfx/NPC.json');
    this.load.atlas('UI', 'assets/gfx/UI.png', 'assets/gfx/UI.json');

    //================ Spells Loaded here ==============================
    //==================================================================
    this.load.atlas('fireBolt', 'assets/gfx/fireBolt.png', 'assets/gfx/fireBolt.json');

    //this.load.spritesheet('player', 'assets/gfx/character.png', 16, 32);
    this.load.spritesheet('overworld', 'assets/gfx/Overworld.png', 16, 16);
    this.load.spritesheet('inner', 'assets/gfx/Inner.png', 16, 16);
    this.load.spritesheet('objects', 'assets/gfx/objects.png', 16, 16);
    this.load.image('inventory', 'assets/gfx/inventory.png');

    this.load.tilemap('test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('house', 'assets/maps/house.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('forestPath', 'assets/maps/forestPath.json', null, Phaser.Tilemap.TILED_JSON);


  },
  create: function() {
      //this.initGameSprites();
      this.state.start('Game', true, false, 'test', 'overworld', 0);
  }
};
