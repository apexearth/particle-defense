var Weapons = require('../Weapons');
var Images = require('../../img');
var Building = require('./building');

module.exports = MissileLauncher;

function MissileLauncher() {
    Building.call(this);
    this.name = 'MissileLauncher';
    this.container.addChild(Images.buildings.Platform);
    this.health = 5;
    this.addWeapon(Weapons.Missile({
        projectileSpeed: 200,
        explosiveSpeed: 45,
        explosiveTime: 2,
        explosiveInitialSize: .1,
        range: 1,
        damage: .95,
        fireRate: .5,
        acceleration: 1,
        accuracy: 8
    }));
}

MissileLauncher.prototype = Object.create(Building.prototype);
MissileLauncher.prototype.constructor = MissileLauncher;

MissileLauncher.cost = {
    energy: 60,
    metal: 30
};
