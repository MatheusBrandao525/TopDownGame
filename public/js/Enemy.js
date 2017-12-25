var TopDownGame = TopDownGame || {};

var enemyUnit = function () {};
var dir = ['n', 's', 'e', 'w'];



enemyUnit.prototype = {
  healthPoints: 10,
  maxHealth: 10,
  sprite: null,
  target: [],
  state: 0,
  facing: 's',
  isWaiting: false,
  waitTimer: null,

  anims: [
    'Idle',
    'Walk'
  ],
  init: function(sprite) {
    let s = this.sprite = sprite;
    let g = TopDownGame.game;

    g.physics.arcade.enable(s);
    s.anchor.setTo(0.5);
    s.x += 8; s.y += 8;
    s.body.setSize(16, 16, 0, 16);

    s.animations.add('nIdle', ['nWalk1'], 5, false);
    s.animations.add('eIdle', ['eWalk1'], 5, false);
    s.animations.add('sIdle', ['sWalk1'], 5, false);
    s.animations.add('wIdle', ['wWalk1'], 5, false);

    s.animations.add('nWalk', Phaser.Animation.generateFrameNames('nWalk', 1, 4), 5, false);
    s.animations.add('eWalk', Phaser.Animation.generateFrameNames('eWalk', 1, 4), 5, false);
    s.animations.add('sWalk', Phaser.Animation.generateFrameNames('sWalk', 1, 4), 5, false);
    s.animations.add('wWalk', Phaser.Animation.generateFrameNames('wWalk', 1, 4), 5, false);
    this.wait();
  },
  animate: function () {
    let a = this.facing + this.anims[this.state];
    this.sprite.animations.play(a);
  },
  move: function(direction, speed){
    this.sprite.body.velocity.y = 0;
    this.sprite.body.velocity.x = 0;
    if(this.isMoving){
      switch(direction){
        case 'n':
          this.sprite.body.velocity.y = -speed;
          break;
        case 's':
          this.sprite.body.velocity.y = speed;
          break;
        case 'e':
          this.sprite.body.velocity.x = speed;
          break;
        case 'w':
          this.sprite.body.velocity.x = -speed;
          break;
      }
    }
  },
  update: function(blockedLayer) {
    let g = TopDownGame.game;
    g.physics.arcade.collide(this.sprite, blockedLayer);
    if(this.isWaiting){
      //perform player check
      console.log("Enemy Waiting");
    }else {
      //perform player check

      //console.log("Enemy: [" + this.sprite.x + ", " + this.sprite.y + "]");
      //console.log("Target: [" + this.target[0] + ", " + this.target[1] + "]");
      if(Math.abs(this.sprite.x - this.target[0]) > 10 || Math.abs(this.sprite.y - this.target[1]) > 10) {
          this.move(this.facing, 40);
      } else if(Math.abs(this.sprite.x - this.target[0]) < 10 && Math.abs(this.sprite.y - this.target[1]) < 10) {
        this.isMoving = false;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.velocity.x = 0;
        this.wait();
      }
    }
    this.state = this.isMoving ? 1 : 0;
    this.animate();
  },
  wait: function(){
    this.isWaiting = true;
    this.waitTimer = TopDownGame.game.time.create();
    var event = this.waitTimer.add(1500, this.waitCB, this);
    this.waitTimer.start();
  },
  waitCB: function(){
    this.waitTimer.stop();
    this.waitTimer.destroy();
    let d = Math.random() * 4;

    this.facing = dir[parseInt(d)];
    this.isMoving = true;
    this.newTarget();
    this.isWaiting = false;
  },
  walkStart: function(){

  },
  newTarget: function (){
  console.log("New Target: " + this.facing);
    switch(this.facing){
      case 'n':
        this.target = [this.sprite.x, this.sprite.y - 50];
        break;
      case 's':
        this.target = [this.sprite.x, this.sprite.y + 50];
        break;
      case 'w':
        this.target = [this.sprite.x - 50, this.sprite.y];
        break;
      case 'e':
        this.target = [this.sprite.x + 50, this.sprite.y];
        break;
    }
  }
}
