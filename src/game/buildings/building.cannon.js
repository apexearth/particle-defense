var Images = require('../../img');
var Weapons = require('../Weapons');
var Building = require('./building');

module.exports = Cannon;

function Cannon() {
    Building.call(this);
    this.name = 'Cannon';
    this.container.addChild(Images.buildings.SmallPlatform);
    this.health = 5;
    this.addWeapon(Weapons.Cannon({
        range: 100,
        fireRate: 30,
        damage: 3,
        projectileSpeed: 2.5,
        shotsPerShot: 1,
        accuracy: .95,
        explosiveSpeed: .35,
        explosiveTime: 1,
        explosiveInitialSize: 5
    }));
}

Cannon.prototype = Object.create(Building.prototype);
Cannon.prototype.constructor = Cannon;

Cannon.cost = {
    energy: 60,
    metal: 30
};
