var Images = require('../../img');
var Weapons = require('../weapons');
var Building = require('./building');

module.exports = Behemoth;

function Behemoth(options) {
    Building.call(this, options);
    this.name = 'Beam';
    this.container.addChild(Images.buildings.SmallPlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Gun({
        level: this.level,
        building: this,
        range: 300,
        fireRate: 60,
        damage: 20,
        projectileSpeed: 6,
        shotsPerShot: 1,
        accuracy: .98
    }));
}

Behemoth.prototype = Object.create(Building.prototype);
Behemoth.prototype.constructor = Behemoth;

Behemoth.cost = {
    energy: 50,
    metal: 40
};

Behemoth.tags = [
    'defense'
];
