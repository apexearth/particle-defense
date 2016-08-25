var Images = require('../../img');
var Weapons = require('../Weapons');
var Building = require('./building');

module.exports = Gun;

function Gun() {
    Building.call(this);
    this.name = 'Gun';
    this.container.addChild(Images.buildings.SmallPlatform);
    this.health = 5;
    this.addWeapon(Weapons.Gun({
        range: 150,
        fireRate: 20,
        damage: 5,
        projectileSpeed: 6,
        shotsPerShot: 1,
        accuracy: .94
    }));
}

Gun.prototype = Object.create(Building.prototype);
Gun.prototype.constructor = Gun;

Gun.cost = {
    energy: 20,
    metal: 10
};
