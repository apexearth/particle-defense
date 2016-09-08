var Images = require('../../img');
var Weapons = require('../weapons');
var Building = require('./Building');

module.exports = GrenadeLauncher;

function GrenadeLauncher(options) {
    Building.call(this, options);
    this.name = 'GrenadeLauncher';
    this.container.addChild(Images.buildings.Platform());
    this.health = 5;
    this.addWeapon(new Weapons.GrenadeLauncher(100, 30, 3, 2, 1, .95, 1, .35, 1, 5));
}

GrenadeLauncher.prototype = Object.create(Building.prototype);
GrenadeLauncher.prototype.constructor = GrenadeLauncher;

GrenadeLauncher.cost = {
    energy: 60,
    metal: 30
};

GrenadeLauncher.tags = [
    'defense'
];
