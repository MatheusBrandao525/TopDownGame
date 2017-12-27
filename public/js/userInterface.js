var TopDownGame = TopDownGame || {};

var userInterface = function() {};

var numbers = Phaser.Animation.generateFrameNames('coin', 0, 9);

userInterface.prototype = {
  hearts: [],
  itemOrb: null,
  expBar: null,
  exp: null,
  expMask: null,
  coinRibbon: null,
  coins: [],
  init: function(game) {
    let player = TopDownGame.player;

    let n = player.healthPoints;
    for(i = 0; i < player.maxHealth / 4; i++){
      let hrt = game.add.sprite(50 + (16 * (i-1)), 5, 'UI');
      if(n > 4){
        hrt.frameName = 'hpHeart4';
        n -= 4
      }else {
        hrt.frameName = 'hpHeart' + n;
        n -= n;
      }
      hrt.fixedToCamera = true;
      this.hearts.push(hrt);
    }

    let inv = game.add.sprite(50, 50, 'inventory');
    inv.scale.setTo(.75, .75);
    inv.fixedToCamera = true;
    inv.visible = false;

    this.itemOrb = game.add.sprite(5, 5, 'UI');
    this.itemOrb.frameName = 'equipped';
    this.itemOrb.fixedToCamera = true;

    this.expBar = game.add.sprite(5, 37, 'UI');
    this.expBar.frameName = 'expBar';
    this.expBar.fixedToCamera = true;

    this.exp = game.add.sprite(21, 37, 'UI');
    this.exp.frameName = 'exp';
    this.exp.fixedToCamera = true;

    this.exp.width = 25;
    this.exp.x = 75;

    game.physics.arcade.enable(this.exp);

    this.coinRibbon = game.add.sprite(5, game.height - 40, 'UI');
    this.coinRibbon.frameName = 'coinRibbon';
    this.coinRibbon.fixedToCamera = true;

    for(c = 0; c < 3; c++){
      let coin = game.add.sprite(28 + (c*10), game.height - 32, 'UI');
      coin.frameName = 'coin0';
      coin.fixedToCamera = true;
      this.coins.push(coin);
    }

  },
  updateCoins: function(total){
    let totString = total.toString().split('');
    let start = 3 - totString.length;
    for(i = 0; i < totString.length; i++){
      this.coins[start + i].frameName = 'coin' + totString[i];
    }
    this.coins.forEach(function(coin, index){
      if(index != 2 && coin.frameName == 'coin0'){
        coin.alpha = 0;
      }else {
        coin.alpha = 1;
      }
    });
  }
}
