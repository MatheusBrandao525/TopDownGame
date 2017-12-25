var TopDownGame = {
  // add variables as needed here
  map: null,
  game: null,
  preload: function () {
    this.game.load.spritesheet('player', 'assets/gfx/character.png', 16, 16);
    this.game.load.spritesheet('overworld', 'assets/gfx/Overworld.png', 16, 16);
    this.game.load.spritesheet('objects', 'assets/gfx/objects.png', 16, 16);

    this.game.load.tilemap('test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
  },
  create: function() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.physics.startSystem(phaser.physics.ARCADE);

    this.map = this.game.add.tilemap('test');
    this.map.addTilesetImage('outside', 'overworld');
    this.map.addTilesetImage('obj', 'objects');

    var maplayer = map.createLayer('Tile Layer 1');
    var maplayer = map.createLayer('Tile Layer 2');
    var maplayer = map.createLayer('Tile Layer 3');
  },
  update: function() {

  },
  render: function () {

  }
}
