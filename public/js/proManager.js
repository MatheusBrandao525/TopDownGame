var TopDownGame = TopDownGame || {};

var proManager = function() {};
var projectile = function() {};

projectile.prototype = {
  x: 0,
  y: 0,
  sprite: null,
  power: 0,
  speed: 0,
  target: {
    x: 0,
    y: 0
  },
  owner: null,
  penetrate: false;
}


proManager.prototype = {
  activeProjectiles: new Array(),
  init: function(game) {
    //might need later
  },
  newProjectile: function(game, source, sprite){

  },
  
}
