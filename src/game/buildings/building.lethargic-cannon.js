var Weapons = require('../weapons');
var Images = require('../../img');
var Building = require('./Building');

module.exports = LethargicCannon;

function LethargicCannon(options) {
    Building.call(this, options);
    this.name = 'LethargicCannon';
    this.container.addChild(Images.buildings.LargePlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Cannon({
        level: this.level,
        building: this,
        range: 200,
        fireRate: 1,
        damage: 5,
        projectileSpeed: 1.75,
        shotsPerShot: 1,
        accuracy: .95,
        explosiveSpeed: .15,
        explosiveTime: 2,
        explosiveInitialSize: 5
    }));
}

LethargicCannon.prototype = Object.create(Building.prototype);
LethargicCannon.prototype.constructor = LethargicCannon;

LethargicCannon.cost = {
    energy: 60,
    metal: 30
};

LethargicCannon.tags = [
    'defense'
];
