var Weapons = require('../Weapons');
var Images = require('../../img');
var Building = require('./building');

module.exports = Shocker;

function Shocker() {
    Building.call(this);
    this.name = 'Shocker';
    this.container.addChild(Images.buildings.LargePlatform);
    this.health = 5;
    this.addWeapon(Weapons.Shocker(100, 30, 10, 1));
}

Shocker.prototype = Object.create(Building.prototype);
Shocker.prototype.constructor = Shocker;

Shocker.cost = {
    energy: 25,
    metal: 20
};
