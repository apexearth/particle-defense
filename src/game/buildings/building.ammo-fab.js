var Images = require('../../img');
var Building = require('./building');

module.exports = AmmoFab;

function AmmoFab(options) {
    Building.call(this, options);
    this.name = 'AmmoFab';
    this.container.addChild(Images.buildings.AmmoFab());
    this.health = 20;
    this.resourceStorage.ammo = 50;
    this.addStorageToPlayer();
    this.resourceGeneration.ammo = 6;
}

AmmoFab.prototype = Object.create(Building.prototype);
AmmoFab.prototype.constructor = AmmoFab;

AmmoFab.cost = {
    energy: 100,
    metal: 50
};
