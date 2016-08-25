var Weapons = require('../Weapons');
var Images = require('../../img');
var Building = require('./building');

module.exports = MachineGun;

function MachineGun() {
    Building.call(this);
    this.name = 'MachineGun';
    this.container.addChild(Images.buildings.LargePlatform);
    this.health = 5;
    this.addWeapon(Weapons.Gun({
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
