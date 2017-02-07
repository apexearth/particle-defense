const Images = require('../../img');
const Weapons = require('../weapons');
const Building = require('./Building');

module.exports = Cannon;

function Cannon(options) {
    Building.call(this, options);
    this.name = 'Cannon';
    this.container.addChild(Images.buildings.SmallPlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Cannon({
        level: this.level,
        building: this,
        range: 100,
        fireRate: 1,
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

Cannon.tags = [
    'defense'
];
