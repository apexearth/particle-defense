var Weapons = require('../Weapons');
var Images = require('../../img');
var Building = require('./building');

module.exports = MachineGun;

function MachineGun(options) {
    Building.call(this, options);
    this.name = 'MachineGun';
    this.container.addChild(Images.buildings.LargePlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Gun({
        level: this.level,
        building: this,
        range: 100,
        fireRate: 5,
        damage: 2,
        projectileSpeed: 6,
        shotsPerShot: 1,
        accuracy: .9
    }));
}

MachineGun.prototype = Object.create(Building.prototype);
MachineGun.prototype.constructor = MachineGun;

MachineGun.cost = {
    energy: 45,
    metal: 20
};
