var Images = require('../../img');
var Building = require('./building');

module.exports = HomeBase;

function HomeBase() {
    Building.call(this);
    this.name = 'HomeBase';
    this.container.addChild(Images.buildings.HomeBase);
    this.health = 5;
    this.resourceStorage.ammo = 200;
    this.resourceStorage.metal = 100;
    this.resourceStorage.energy = 200;
    this.resourceGeneration.ammo = 6;
    this.resourceGeneration.metal = 1.5;
    this.resourceGeneration.energy = 3;
    if (this.player) this.player.homeBase = this;
}

HomeBase.prototype = Object.create(Building.prototype);
HomeBase.prototype.constructor = HomeBase;

HomeBase.cost = {
    energy: 20,
    metal: 10
};
