var Images = require('../../img');
var Weapons = require('../Weapons');
var Building = require('./building');

module.exports = FastGun;

function FastGun(options) {
    Building.call(this, options);
    this.name = 'FastGun';
    this.container.addChild(Images.buildings.EnergyFab());
    this.health = 5;
    this.addWeapon(new Weapons.Gun({
        level: this.level,
        building: this,
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
