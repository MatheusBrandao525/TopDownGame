var TopDownGame = TopDownGame || {};
var sm = sm || {};
var proManager = function() {};

var fireBoltFrames = Phaser.Animation.generateFrameNames('fireBolt', 0, 7);
var shieldUp = Phaser.Animation.generateFrameNames('shield', 0, 9);
var shieldDown = Phaser.Animation.generateFrameNames('shield', 9, 0);

var spells = [];

var shieldTimer;

//============ Spell Types
const PROJECTILE = 0;
const SHIELD = 1;
const AREA = 2;
const BUFF = 3;
const MINION = 4;

//============  Target Types
const SELF = 0;
const MOUSE = 1;


function spellObj(id, name, owner, type, target, spriteName, start, life, hp, count){
  this.id = id;
  this.name = name; //Display name
  this.owner = owner; //player who cast spell
  this.type = type;
  this.targetType = target;
  this.spriteName = spriteName;
  this.sprite = []; //projectiles and minions may have multiple entities
  this.start = start; //Starting time
  this.lifeSpan = life; //default 0 = infinite
  this.hp = hp;
  this.spriteCount = count;
};


proManager.prototype = {
  init: function(game) {
    spells = [];
    shieldTimer = game.time.create(false);

  },
  newSpell: function(game, owner, spellInfo, mouse){
    let spell = new spellObj(
      spellInfo.id,
      spellInfo.name,
      owner,
      spellInfo.type,
      spellInfo.targetType,
      spellInfo.spriteName,
      game.time.create(50000, false),
      spellInfo.lifeSpan,
      spellInfo.hp,
      spellInfo.count
    );

    spells.push(spell);

    switch(spell.type){

      case PROJECTILE:
        this.newProjectile(game, spell, mouse);
      break;

      case SHIELD:
        this.newShield(game, spell);
      break;

    };
  },
  newProjectile: function (game, spell, mouse){


    let tAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(spell.owner.sprite.x, spell.owner.sprite.y, mouse.x, mouse.y) + 90;
    if(tAngle < 0) tAngle += 360;

    //Add loop for multi shot projectile sprite.addChild

    let s = spell.sprite = sm.objects.create(spell.owner.sprite.x, spell.owner.sprite.y, spell.spriteName);
    s.angle = tAngle;
    s.anchor.setTo(0.5);
    game.physics.arcade.enable(s);
    s.width = 32;
    s.height = 32;
    s.checkWorldBounds = true;
    s.events.onOutOfBounds.add(()=>{removeSpell(spell)}, this);
    s.animations.add('fly', fireBoltFrames, 15, true);
    s.animations.play('fly');
    game.physics.arcade.velocityFromAngle(s.angle - 90, 200, s.body.velocity);
  },
  newShield: function (game, spell) {
    if(spell.owner.shield == null){
      let s = spell.sprite = sm.objects.create(spell.owner.sprite.x, spell.owner.sprite.y, spell.spriteName);
      s.anchor.setTo(0.5);
      game.physics.enable(s);
      s.width = 40;
      s.height = 40;
      s.animations.add('up', shieldUp, 30, false);
      s.animations.add('down', shieldDown, 30, false);
      s.animations.play('up');
      //game.time.events.add(Phaser.Timer.SECOND * 20, loseShield(spell), game);
      spell.start.add(Phaser.Timer.SECOND * spell.lifeSpan, loseShield, spell);
      spell.start.start();
      s.bringToTop();
      spell.owner.shield = spell;
    }
  },
  collisionCheck: function (objects) {
    spells.forEach( spell => {

    });
  },
  updateShields: function () {
    spells.forEach( spell => {
      if(spell.type == SHIELD){
        spell.sprite.x = spell.owner.sprite.x;
        spell.sprite.y = spell.owner.sprite.y;
      }
    });
  }
};a

function removeSpell(spell){
  console.log(spell);
  let i = spells.indexOf(spell);
  spells = spells.splice(i, 1);
  spell.sprite.destroy();
}

function loseShield(){
  this.sprite.animations.play('down');
  this.sprite.animations.currentAnim.onComplete.add(function() {
    this.owner.shield = null;
    removeSpell(this);
  }, this);
}
