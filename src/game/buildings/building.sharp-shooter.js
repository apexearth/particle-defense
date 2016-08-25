var Weapons = require('../Weapons');
var Images = require('../../img');
var Building = require('./building');

module.exports = SharpShooter;

function SharpShooter() {
    Building.call(this);
    this.name = 'SharpShooter';
    this.container.addChild(Images.buildings.LargePlatform);
    this.health = 5;
    this.addWeapon(Weapons.Gun({
        range: 200,
        fireRate: 30,
        damage: 20,
        projectileSpeed: 60,
        shotsPerShot: 1,
        accuracy: .995
    }));
}

SharpShooter.prototype = Object.create(Building.prototype);
SharpShooter.prototype.constructor = SharpShooter;

SharpShooter.cost = {
    energy: 40,
    metal: 20
};
