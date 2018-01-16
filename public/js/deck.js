var TopDownGame = TopDownGame || {};

var card = {
  id: "000",
  name: "Firebolt",
  type: 0,
  cost: 2,
  power: 5,
  speed: 1,
  animation: "fireBolt"
};

var deck = function() {};

deck.prototype = {
  cards: [],
  name: "[Deck Name]",
  id: "[DB ID]",
  onDeck: "[Card ID]",
  spellOne: "[Card ID]",
  spellTwo: "[Card ID]",
  loadDeck: function (deckString){
    this.cards.push(card);
    this.spellOne = card.id
  },
  drawCard: function () {

  },
  newHand: function () {

  }
}
