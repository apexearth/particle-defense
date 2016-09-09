var Weapons = require('../weapons');
var Images = require('../../img');
var Building = require('./Building');

module.exports = Shocker;

function Shocker(options) {
    Building.call(this, options);
    this.name = 'Shocker';
    this.container.addChild(Images.buildings.LargePlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Shocker({
        level: this.level,
        building: this,
        range: 100,
        lifeSpan: 60,
        damage: 4,
        fireRate: 45,
        accuracy: .95
    }));
}

Shocker.prototype = Object.create(Building.prototype);
Shocker.prototype.constructor = Shocker;

Shocker.cost = {
    energy: 25,
    metal: 20
};

Shocker.tags = [
    'defense'
];
