var Images = require('../../img');
var Weapons = require('../weapons');
var Building = require('./Building');

module.exports = GrenadeLauncher;

function GrenadeLauncher(options) {
    Building.call(this, options);
    this.name = 'GrenadeLauncher';
    this.container.addChild(Images.buildings.Platform());
    this.health = 5;
    this.addWeapon(new Weapons.GrenadeLauncher({
        level: this.level,
        building: this,
        range: 100,
        projectileSpeed: 150,
        explosiveSpeed: 45,
        explosiveTime: 2,
        explosiveInitialSize: .1,
        lifeSpan: 60,
        damage: 4,
        fireRate: 45,
        accuracy: .95
    }));
}

GrenadeLauncher.prototype = Object.create(Building.prototype);
GrenadeLauncher.prototype.constructor = GrenadeLauncher;

GrenadeLauncher.cost = {
    energy: 60,
    metal: 30
};

GrenadeLauncher.tags = [
    'defense'
];
