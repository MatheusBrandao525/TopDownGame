var TopDownGame = TopDownGame || {};

var userInterface = function() {};

var hpBar, hpBG, enemyHPbar, enemyHPbg;

userInterface.prototype = {
  currentHealth: 0,
  currentPower: 0,
  enemyHealth: 0,
  gui: null,
  init: function(game) {
    let player = TopDownGame.player;
    this.gui = game.add.group();

    hpBG = game.add.graphics();
    hpBG.lineStyle(1, 0x666666, 1);
    hpBG.beginFill(0x000000, .65);
    hpBG.drawRect(10, 285, 74, 10);
    hpBG.endFill();
    this.gui.add(hpBG);

    hpBar = game.add.graphics();
    hpBar.lineStyle(0, null, 1);
    hpBar.beginFill(0x00ff00, 1);
    hpBar.drawRect(12, 287, 70, 6);
    hpBar.endFill();
    this.gui.add(hpBar);

    this.gui.fixedToCamera = true;
  },
  updatePlayer: function(playerHP, playerMP) {

  },
  updateEnemy: function(eHealth){

  }
}
