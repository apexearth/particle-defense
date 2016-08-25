var Images = require('../../img');
var Building = require('./building');

module.exports = EnergyFab;

function EnergyFab() {
    Building.call(this);
    this.name = 'EnergyFab';
    this.container.addChild(Images.buildings.EnergyFab);
    this.health = 5;
    this.resourceStorage.energy = 100;
    this.resourceGeneration.energy = 3;
}

EnergyFab.prototype = Object.create(Building.prototype);
EnergyFab.prototype.constructor = EnergyFab;

EnergyFab.cost = {
    energy: 35,
    metal: 20
};
