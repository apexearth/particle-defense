var Images = require('../../img');
var Building = require('./Building');

module.exports = HomeBase;

function HomeBase(options) {
    Building.call(this, options);
    this.name = 'HomeBase';
    this.container.addChildAt(Images.buildings.HomeBase(), 0);
    this.health = 5;
    this.resourceStorage.ammo = 200;
    this.resourceStorage.metal = 100;
    this.resourceStorage.energy = 200;
    this.addStorageToPlayer();
    this.resourceGeneration.ammo = 6;
    this.resourceGeneration.metal = 1.5;
    this.resourceGeneration.energy = 3;
    if (this.player) this.player.homeBase = this;

}

HomeBase.prototype = Object.create(Building.prototype);
HomeBase.prototype.constructor = HomeBase;

HomeBase.cost = {
    energy: 200,
    metal: 100
};

HomeBase.tags = [
    'base',
];
