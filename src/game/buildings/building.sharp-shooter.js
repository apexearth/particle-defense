var Weapons = require('../weapons');
var Images = require('../../img');
var Building = require('./Building');

module.exports = SharpShooter;

function SharpShooter(options) {
    Building.call(this, options);
    this.name = 'SharpShooter';
    this.container.addChild(Images.buildings.LargePlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Gun({
        level: this.level,
        building: this,
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

SharpShooter.tags = [
    'defense'
];
