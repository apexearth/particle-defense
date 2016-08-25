var Images = require('../../img');
var Weapons = require('../Weapons');
var Building = require('./building');

module.exports = GrenadeLauncher;

function GrenadeLauncher() {
    Building.call(this);
    this.name = 'GrenadeLauncher';
    this.container.addChild(Images.buildings.Platform);
    this.health = 5;
    this.addWeapon(Weapons.GrenadeLauncher(100, 30, 3, 2, 1, .95, 1, .35, 1, 5));
}

GrenadeLauncher.prototype = Object.create(Building.prototype);
GrenadeLauncher.prototype.constructor = GrenadeLauncher;

GrenadeLauncher.cost = {
    energy: 60,
    metal: 30
};
