var Weapons = require('../weapons');
var Images = require('../../img');
var Building = require('./Building');

module.exports = Shocker;

function Shocker(options) {
    Building.call(this, options);
    this.name = 'Shocker';
    this.container.addChild(Images.buildings.LargePlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Shocker(100, 30, 10, 1));
}

Shocker.prototype = Object.create(Building.prototype);
Shocker.prototype.constructor = Shocker;

Shocker.cost = {
    energy: 25,
    metal: 20
};

Shocker.tags = [
    'defense'
];
