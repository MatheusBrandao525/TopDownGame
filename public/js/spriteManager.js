var TopDownGame = TopDownGame || {};

var spriteManager = function() {};

var smallChestFrames = Phaser.Animation.generateFrameNames('smChest', 1, 4);
var largeChestFrames = Phaser.Animation.generateFrameNames('lgChest', 1, 4);
var bushFrames = Phaser.Animation.generateFrameNames('bush', 1, 5);
var potFrames = Phaser.Animation.generateFrameNames('pot', 1, 5);
var coinSpin = Phaser.Animation.generateFrameNames('coin', 1, 4);
var heartSpin = Phaser.Animation.generateFrameNames('heart', 1, 4);

spriteManager.prototype = {
  bushObjects: new Array(),
  liftObjects: new Array(),
  chestObjects: new Array(),
  objects: null,
  heldObject: null,
  bushes: null,
  drops: null,
  init: function(game) {
    // might need later
  },
  loadMapObjects: function(game, map) {
    this.drops = game.add.group();
    this.objects = game.add.group();
    this.heldObject = game.add.group();
    this.bushes = game.add.group();


    map.objects['objects'].forEach(function(element){
        element.y -= map.tileHeight;

        switch(element.properties.type){
          case 'bush':
            this.addBush(game, element);
            break;
          case 'pot':
            this.addPot(game, element);
            break;
          case 'chest':
            this.addChest(game, element);
            break;
          case 'playerStart':
              //IGNORE
            break;
        }
    }, this);

  },
  clearMapObjects: function () {
    //clear out objects group
  },
  addBush: function(game, element) {
    let bush = this.objects.create(element.x, element.y, 'items');
    bush.frameName = 'bush1';
    bush.anchor.setTo(0.5);
    bush.x += 8;
    bush.y += 8;
    bush.animations.add('cut', Phaser.Animation.generateFrameNames('bush', 1, 5), 15, false);
    game.physics.arcade.enable(bush);
    bush.body.checkCollision.up = false;
    bush.body.checkCollision.down = false;
    bush.body.checkCollision.left = false;
    bush.body.checkCollision.right = false;
    bush.action = 'cut'
    bush.objType = 'bush'
  },
  addPot: function(game, element) {
    let pot = this.objects.create(element.x, element.y, 'items');
    pot.frameName = 'potGround';
    pot.anchor.setTo(0.5);
    pot.x += 8;
    pot.y += 8;
    pot.animations.add('break', Phaser.Animation.generateFrameNames('pot', 1, 5), 15, false);
    game.physics.arcade.enable(pot);
    pot.body.immovable = true;
    pot.body.setSize(10, 10, 3, 6);

    pot.action = 'lift';
    pot.objType = 'pot';
  },
  addChest: function(game, element) {
    let chest = this.objects.create(element.x, element.y, 'items');
    chest.frameName = 'smChest1';
    chest.anchor.setTo(0.5);
    chest.x += 8;
    chest.y += 8;
    chest.animations.add('open', Phaser.Animation.generateFrameNames('smChest', 1, 4), 8, false);
    game.physics.arcade.enable(chest);
    chest.body.immovable = true;

    chest.isOpen = false;
    chest.action = 'open';
    chest.objType = 'chest';
  },
  itemDrop: function(parent, chance) {
    let choice = Math.random() * 100 + 1;
    let xRnd = Math.random() * 30 - 15;
    let yRnd = Math.random() * 40 - 20;
    let drop;
    if(choice < 25 * chance) { //coin drop
      drop = this.drops.create(parent.x, parent.y, 'items');
      drop.anchor.setTo(0.5);
      TopDownGame.game.physics.arcade.enable(drop);
      drop.body.setSize(8, 8, 4, 4);
      drop.animations.add('spin', coinSpin, 8, true);
      drop.animations.add('poof', Phaser.Animation.generateFrameNames('smoke', 1, 3), 10, false);
      drop.animations.play('spin');
      drop.objType = 'coin';

    }else if(choice < 50 * chance) { //heart drop
      drop = this.drops.create(parent.x, parent.y, 'items');
      drop.anchor.setTo(0.5);
      TopDownGame.game.physics.arcade.enable(drop);
      drop.body.setSize(8, 8, 4, 4);
      drop.animations.add('spin', heartSpin, 8, true);
      drop.animations.add('poof', Phaser.Animation.generateFrameNames('smoke', 1, 3), 10, false);
      drop.animations.play('spin');
      drop.objType = 'heart';
    }else { //no drop
    }
    //Bezier Curve
    if(drop) {
      let xArray = [parent.x, parent.x, parent.x + xRnd, parent.x + xRnd];
      let yArray = [parent.y, parent.y - 32, parent.y, parent.y + 7];
      let dropTween = parent.game.add.tween(drop).to({
        x: xArray,
        y: yArray
      }, 300, Phaser.Easing.Quadratic.InOut, true, 0, 0).interpolation(function(v, k){
          return Phaser.Math.bezierInterpolation(v, k);
      });
    }
  },
  pickUp: function(obj) {
      var held = this.heldObject.add(obj);
      held.body.immovable = false;
      held.frameName = 'potLift';
      held.bringToTop();
      return held;
  }
}
