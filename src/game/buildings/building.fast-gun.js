var Images = require('../../img');
var Weapons = require('../Weapons');
var Building = require('./building');

module.exports = FastGun;

function FastGun() {
    Building.call(this);
    this.name = 'FastGun';
    this.container.addChild(Images.buildings.EnergyFab);
    this.health = 5;
    this.addWeapon(Weapons.Gun({
        range: 100,
        fireRate: 10,
        damage: 3,
        projectileSpeed: 6,
        shotsPerShot: 1,
        accuracy: .94
    }));
}

FastGun.prototype = Object.create(Building.prototype);
FastGun.prototype.constructor = FastGun;

FastGun.cost = {
    energy: 30,
    metal: 15
};
