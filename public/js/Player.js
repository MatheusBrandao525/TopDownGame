var TopDownGame = TopDownGame || {};
const IDLE = 0;
const WALK = 1;
const ATTACK = 2;
const LIFT = 3;
const CARRY = 4;
const CARRY_IDLE = 5;
const GRAB = 6;
const THROW = 7;



var playerObj = function () {};

playerObj.prototype = {
  walkSpeed: 75,
  runSpeed: 120,
  healthPoints: 7,
  maxHealth: 12,
  coins: 0,
  level: 1,
  exp: 0,
  tilNextLevel: 100,
  sprite: null,
  facing: 's',
  newFacing: 's',
  isMoving: false,
  hasObject: false,
  heldObject: null,
  equippedWeapon: null,
  state: 0,
  attackHit: false,
  newState: 0,
  touched: null,
  holding: false,
  busy: false,
  anims: [
    'Idle',
    'Walk',
    'Attack',
    'Lift',
    'Carry',
    'cIdle',
    'Grab',
    'Throw'
  ],
  touching: function(me, obj) {
    //console.log(sm.objects.getChildIndex(obj));
    this.touched = sm.objects.getChildIndex(obj);
  },
  setAnimations: function() {
    this.sprite.animations.add('sIdle', ['sWalk1'], 5, false);
    this.sprite.animations.add('nIdle', ['nWalk1'], 5, false);
    this.sprite.animations.add('wIdle', ['wWalk1'], 5, false);
    this.sprite.animations.add('eIdle', ['eWalk1'], 5, false);

    this.sprite.animations.add('scIdle', ['sCarry1'], 5, false);
    this.sprite.animations.add('ncIdle', ['nCarry1'], 5, false);
    this.sprite.animations.add('wcIdle', ['wCarry1'], 5, false);
    this.sprite.animations.add('ecIdle', ['eCarry1'], 5, false);

    this.sprite.animations.add('sGrab', ['sLift1'], 1, false);
    this.sprite.animations.add('nGrab', ['nLift1'], 1, false);
    this.sprite.animations.add('wGrab', ['wLift1'], 1, false);
    this.sprite.animations.add('eGrab', ['eLift1'], 1, false);

    this.sprite.animations.add('sWalk', Phaser.Animation.generateFrameNames('sWalk', 1, 4), 5, false);
    this.sprite.animations.add('nWalk', Phaser.Animation.generateFrameNames('nWalk', 1, 4), 5, false);
    this.sprite.animations.add('wWalk', Phaser.Animation.generateFrameNames('wWalk', 1, 4), 5, false);
    this.sprite.animations.add('eWalk', Phaser.Animation.generateFrameNames('eWalk', 1, 4), 5, false);

    this.sprite.animations.add('sLift', Phaser.Animation.generateFrameNames('sLift', 1, 3), 5, false);
    this.sprite.animations.add('nLift', Phaser.Animation.generateFrameNames('nLift', 1, 3), 5, false);
    this.sprite.animations.add('wLift', Phaser.Animation.generateFrameNames('wLift', 1, 3), 5, false);
    this.sprite.animations.add('eLift', Phaser.Animation.generateFrameNames('eLift', 1, 3), 5, false);

    this.sprite.animations.add('sThrow', Phaser.Animation.generateFrameNames('sLift', 3, 1), 5, false);
    this.sprite.animations.add('nThrow', Phaser.Animation.generateFrameNames('nLift', 3, 1), 5, false);
    this.sprite.animations.add('wThrow', Phaser.Animation.generateFrameNames('wLift', 3, 1), 5, false);
    this.sprite.animations.add('eThrow', Phaser.Animation.generateFrameNames('eLift', 3, 1), 5, false);

    this.sprite.animations.add('sCarry', Phaser.Animation.generateFrameNames('sCarry', 1, 4), 5, false);
    this.sprite.animations.add('nCarry', Phaser.Animation.generateFrameNames('nCarry', 1, 4), 5, false);
    this.sprite.animations.add('wCarry', Phaser.Animation.generateFrameNames('wCarry', 1, 4), 5, false);
    this.sprite.animations.add('eCarry', Phaser.Animation.generateFrameNames('eCarry', 1, 4), 5, false);

    this.sprite.animations.add('sAttack', Phaser.Animation.generateFrameNames('sAttack', 1, 4), 10, false);
    this.sprite.animations.add('nAttack', Phaser.Animation.generateFrameNames('nAttack', 1, 4), 10, false);
    this.sprite.animations.add('wAttack', Phaser.Animation.generateFrameNames('wAttack', 1, 4), 10, false);
    this.sprite.animations.add('eAttack', Phaser.Animation.generateFrameNames('eAttack', 1, 4), 10, false);

    this.sprite.animations.play('sIdle');

  },
  setState(state, force){
    force = typeof force === 'undefined' ? false : force; //default not to force state change

    if(force){
      this.state = state;
    }else{
      if(this.sprite.animations.currentAnim.isFinished){
        this.state = state;
      }
    }
  },
  command: function(keys){

    if(this.busy == false){
      if(keys.left.isDown){
        this.isMoving = true;
        this.newFacing = 'w';
      }else if(keys.right.isDown){
        this.isMoving = true;
        this.newFacing = 'e';
      }else if(keys.up.isDown){
        this.isMoving = true;
        this.newFacing = 'n';
      }else if(keys.down.isDown){
        this.isMoving = true;
        this.newFacing = 's';
      }else{
        this.isMoving = false;
      }
    }


    if(keys.attack.isDown){ // Q Key
      if(this.state != ATTACK && this.holding == false){
        this.isMoving = false;
        this.busyStart();
        this.sprite.animations.stop();
        this.newState = ATTACK;
      }
    }

    if(keys.use.isDown){// E Key
      this.isMoving = false;
      if(this.busy == false){
        if(this.holding && this.state != GRAB){
          throwObj();
        }else {
          this.action();
        }
        this.busyStart();
      }
    }

    if(this.isMoving){
      if(this.holding){
        this.newState = CARRY;
      }else {
        this.newState = WALK;
      }
    }else if(this.busy == false){
      if(this.holding){
        this.newState = CARRY_IDLE;
      }else{
        this.newState = IDLE;
      }

    }
    if(this.busy == false){ this.facing = this.newFacing; }
  },
  move: function (direction, speed) {
    if(this.isMoving){
      switch(direction) {
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
    if(this.holding){
      let held = sm.heldObject.children[0];
      held.x = this.sprite.x + 1;
      held.y = this.sprite.y - 12;
    }
  },
  action: function(){
    let obj = findCloseObject(TopDownGame.game);
    //console.log(obj);
    if(obj) {
      switch(obj.action){
        case 'lift':
          if(this.state != GRAB && !this.holding) {
            this.newState = GRAB;
            let pot = sm.pickUp(obj);
            pot.x = this.sprite.x;
            pot.y = this.sprite.y-12;
            this.holding = true;
          }
          break;
        case 'open':
          this.newState = GRAB;
          //let chest = sm.objects.getChildAt(player.touched);
          if(obj.isOpen == false){
            obj.animations.play('open');
            obj.isOpen = true;
            sm.itemDrop(obj, 2);
          }
          break;
      }
    }
  },
  attackCollision: function() {
    let player = this.sprite;
    if(this.state == ATTACK && this.attackHit == false){
      sm.objects.forEach(function(bush){
        if(bush.objType && bush.objType == 'bush'){
          TopDownGame.game.physics.arcade.overlap(player, bush, function() {
            if(this.attackHit == false){
              this.attackHit = true;
              this.sprite.animations.currentAnim.onComplete.add(function(){ this.attackHit = false; }, this)
              bush.play('cut');
              bush.animations.currentAnim.onComplete.add(function() {
                sm.itemDrop(bush, 1);
                bush.destroy();
                //create item drop
              });
            }
          }, null, this);
        }
      }, this);
    }
  },
  animate: function() {
    //this.sprite.animations.currentAnim.loop = false;
    if(this.state == ATTACK && this.sprite.animations.currentAnim.isFinished) this.newState = IDLE;

    if(this.state != this.newState || this.facing != this.newFacing || this.sprite.animations.currentAnim.isFinished){
      if((this.state == ATTACK || this.state == LIFT || this.state == CARRY) && this.sprite.animations.currentAnim.isFinished) {
        this.state = this.newState;
        this.facing = this.newFacing;
        this.sprite.animations.play(this.facing + this.anims[this.state]);
      }else {
        this.state = this.newState;
        this.facing = this.newFacing;
        this.sprite.animations.play(this.facing + this.anims[this.state]);
      }
    }
    //this.sprite.animations.play(this.facing + this.anims[this.state]);

      if(this.state == ATTACK) {

        switch(this.facing){
          case 'n':
            this.sprite.body.setSize(16, 7, 8, 3);
            break;
          case 's':
            this.sprite.body.setSize(16, 7, 8, 25);
            break;
          case 'e':
            this.sprite.body.setSize(7, 16, 25, 12);
            break;
          case 'w':
            this.sprite.body.setSize(7, 16, 3, 12);
            break;
        }
        this.attackCollision();
      } else {
        this.sprite.body.setSize(10, 13, 3, 18);
      }
    if(this.holding && !this.isMoving){
      if(this.state == CARRY){
        this.state = CARRY_IDLE;
      }
    }
    if(this.state == GRAB && this.holding){
      this.newState = CARRY;
    }

  },
  busyStart: function() {
    busyTimer = TopDownGame.game.time.create();
    var timerEvent = busyTimer.add(500, notBusy, TopDownGame.game);
    busyTimer.start();
    this.busy = true;
  }
};

function canTouch(game, obj){
  let player = TopDownGame.player;
  let pSprite = player.sprite;
  if(game.physics.arcade.distanceBetween(pSprite, obj) < 25){
    switch(player.facing) {
      case 'n':
        if(obj.y < pSprite.y){
          if(pSprite.x > obj.x - (pSprite.width / 2) && pSprite.x + (pSprite.width / 2) < obj.x + obj.width) {
            return true;
          }
        }
        break;
      case 's':
        if(pSprite.y < obj.y){
          if(pSprite.x > obj.x - (pSprite.width / 2) && pSprite.x + (pSprite.width / 2) < obj.x + obj.width) {
            return true;
          }
        }
        break;
      case 'w':
          if(obj.x < pSprite.x){
            if(pSprite.y > obj.y - (pSprite.height / 2) && pSprite.y + (pSprite.height / 2)  < obj.y + obj.height){
              return true;
            }
          }
        break;
      case 'e':
        if(obj.x > pSprite.x){
          if(pSprite.y > obj.y - (pSprite.height / 2) && pSprite.y + (pSprite.height / 2)  < obj.y + obj.height){
            return true;
          }
        }
        break;
    }
  }
}

function notBusy() {
  busyTimer.stop();
  busyTimer.destroy();
  TopDownGame.player.busy = false;
}

function findCloseObject(game){
  let found = null;
  sm.objects.forEach(function(obj){
    if(obj.action){
      if(canTouch(this, obj)){
        found = obj;
      }
    }
  }, game);
  return found;
}
