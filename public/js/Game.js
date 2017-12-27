var TopDownGame = TopDownGame || {};

TopDownGame.Game = function () {};

var background, paths, blocked, overlay;

var waitTimer;

var sm = new spriteManager();
var ui = new userInterface();
var enemyList = [];
var busyTimer = null;
var mouse = {
  x: 0,
  y: 0,
  left: null,
  right: null
};
TopDownGame.Game.prototype = {
  paused: false, //Needs removed in multiplayer
  pauseDelay: false,
  mapName: null,
  playerStart: 0,
  env: null,
  doors: null,
  init: function(mapName, env, playerStart) {
    this.mapName = mapName;
    this.playerStart = playerStart;
    this.env = env;
  },
  create: function () {
    this.game.scale.setGameSize(533, 300);

    console.log(this.mapName);
    this.map = this.game.add.tilemap(this.mapName);
    this.map.addTilesetImage('env', this.env);
    this.map.addTilesetImage('obj', 'objects');

    this.doors = this.game.add.group();
    this.map.objects['doors'].forEach(function(door) {
      let d = this.doors.create(door.x, door.y - 16, 'objects');
      d.mapName = door.properties.mapName;
      d.env = door.properties.env;
      d.playerStart = door.properties.start;
      this.game.physics.arcade.enable(d);
      d.body.setSize(10, 8, 3, 8);
    }, this);

    background = this.map.createLayer('background');
    paths = this.map.createLayer('paths');
    blocked = this.map.createLayer('Blocked');

    background.resizeWorld();



    sm.loadMapObjects(this.game, this.map);

    enemyList.length = 0;
    if(this.map.objects['npc']){
      this.map.objects['npc'].forEach(function(enemy) {
        let e = new enemyUnit();
        let eSprite = sm.objects.create(enemy.x, enemy.y, 'NPC');
        e.init(eSprite);
        this.physics.arcade.enable(eSprite);
        enemyList.push(e);
      }, this);
    }



    let pStarts = this.findObjectsByType('playerStart', this.map, 'starts');
    let player = TopDownGame.player.sprite = sm.objects.create(pStarts[this.playerStart].x, pStarts[this.playerStart].y, 'player');

    overlay = this.map.createLayer('overlay');

    player.anchor.setTo(0.5);
    player.x += 8; player.y +=8;
    this.physics.arcade.enable(player);
    this.physics.arcade.enable(blocked);
    TopDownGame.player.setAnimations();

    player.body.setSize(10, 10, 3, 18);

    ui.init(this.game);
    ui.updateCoins(TopDownGame.player.coins);

    this.map.setCollisionBetween(1, 5000, true, blocked);

    this.game.camera.follow(TopDownGame.player.sprite, Phaser.Camera.FOLLOW_TOPDOWN);
    //this.keys = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.keys = {
      up: TopDownGame.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: TopDownGame.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: TopDownGame.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: TopDownGame.game.input.keyboard.addKey(Phaser.Keyboard.D),
      use: TopDownGame.game.input.keyboard.addKey(Phaser.Keyboard.E),
      attack: TopDownGame.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      menu: TopDownGame.game.input.keyboard.addKey(Phaser.Keyboard.TAB)
    };

  },
  update: function () {
    if(!this.paused){
      let player = TopDownGame.player;
      let sprite = player.sprite;
      sprite.body.velocity.x = 0;
      sprite.body.velocity.y = 0;

      mouse.x = this.game.input.worldX;
      mouse.y = this.game.input.worldY;
      mouse.left = this.game.input.activePointer.leftButton.isDown;
      mouse.right = this.game.input.activePointer.rightButton.isDown;

      this.game.physics.arcade.collide(sprite, blocked);
      this.game.physics.arcade.collide(sprite, sm.objects, player.touching, null, player);

      dropCheck(this.game);
      doorCheck(this.game, this.doors);

      let v = player.walkSpeed;
      if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
        v = player.runSpeed;
      }

      player.command(this.keys, mouse);
      player.move(player.moveDir, v);
      player.animate();

      enemyList.forEach(function(e){
        e.update(blocked);
      });
    }else {
      //Do something here aka menu

    }

    if(this.keys.menu.isDown && !this.pauseDelay){
      //this.paused = !this.paused;
      //this.pauseDelay = true;
    //  wait();
      console.log("Paused: " + this.paused);
    }
  },
  render: function () {
    bushCheck();
    let player = TopDownGame.player;
    //this.game.debug.body(ui.exp);

  },
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  }
}// Game Object End

function bushCheck() {
  let player = TopDownGame.player;
  let game = TopDownGame.game;
  player.sprite.bringToTop();

  sm.objects.forEach(function(obj){
    if(obj.objType && obj.objType == 'bush'){
      let d = game.physics.arcade.distanceBetween(player.sprite, obj);
      if(d < 15 && obj.y > player.sprite.y + 5){
        obj.bringToTop();
      }
      enemyList.forEach(function(e){
        e.sprite.bringToTop();
        let d2 = game.physics.arcade.distanceBetween(e.sprite, obj);
        if(d2 < 15 && obj.y > e.sprite.y + 5){
          obj.bringToTop();
        }
      });
    }
  });
}

function doorCheck(game, doors) {
  let player = TopDownGame.player.sprite;
  game.physics.arcade.overlap(player, doors, function(player, door){
      this.game.state.start('Game', true, false, door.mapName, door.env, door.playerStart);
  }, null, TopDownGame);
}

function dropCheck(game) {
  let sprite = TopDownGame.player.sprite;
  game.physics.arcade.overlap(sprite, sm.drops, function(playerSprite, drop) {
    if(this.state != ATTACK){
      if(drop.objType == 'heart'){
          drop.animations.play('poof');
          drop.animations.currentAnim.onComplete.add(function(drop, anim){
            if(this.healthPoints != this.maxHealth) this.healthPoints++;
            drop.destroy();
          }, this);
      }else if(drop.objType == 'coin'){
        drop.animations.play('poof');
        drop.animations.currentAnim.onComplete.add(function(drop, anim){
          this.coins++;
          ui.updateCoins(this.coins);
          drop.destroy();
        }, this);
      }
    }
  }, null, TopDownGame.player);
}

function throwObj(){
  let player = TopDownGame.player;
  let obj = sm.heldObject.children[0];
  let game = TopDownGame.game;

  obj.thrown = true;
  player.newState = GRAB;
  player.holding = false;
  let changes = {};
  let xArray = [obj.x, obj.x];
  let yArray = [obj.y, obj.y - 10];

  switch(player.facing){
    case 'n':
      xArray.push(obj.x);
      xArray.push(obj.x);
      yArray.push(obj.y - 40);
      yArray.push(obj.y - 20);
      break;
    case 's':
    xArray.push(obj.x);
    xArray.push(obj.x);
    yArray.push(obj.y + 20);
    yArray.push(obj.y + 40);
      break
    case 'w':
      xArray.push(obj.x - 30); //handle
      xArray.push(obj.x - 30); //end point
      yArray.push(obj.y - 10); //handle
      yArray.push(obj.y + 15); //end point
      break;
    case 'e':
    xArray.push(obj.x + 30);
    xArray.push(obj.x + 30);
    yArray.push(obj.y - 10);
    yArray.push(obj.y + 15);
      break;
  }

  let throwTween = game.add.tween(obj).to({
    x: xArray,
    y: yArray
  }, 200, Phaser.Easing.Quadratic.InOut, true, 0, 0).interpolation(function(v, k){
      return Phaser.Math.bezierInterpolation(v, k);
  });
  throwTween.onComplete.add(function(obj, tween) {
    obj.animations.play('break');
    obj.animations.currentAnim.onComplete.add(function(obj) {
      sm.itemDrop(obj, 1);
      obj.destroy();
    }, this);
  });
}


function wait(){
  waitTimer = TopDownGame.game.time.create();
  let event = waitTimer.add(1500, () => {
    waitTimer.stop();
    waitTimer.destroy();

    this.pauseDelay = false;
    console.log("wait over");
  }, this);
  waitTimer.start();
}
