var Images = require('../../img');
var Weapons = require('../Weapons');
var Building = require('./building');

module.exports = Beam;

function Beam(options) {
    Building.call(this, options);
    this.name = 'Beam';
    this.container.addChild(Images.buildings.SmallPlatform());
    this.health = 5;
    this.addWeapon(Weapons.Laser({
        range: 100,
        lifeSpan: 1,
        damage: .05,
        fireRate: 3,
        accuracy: .95
    }));
}

Beam.prototype = Object.create(Building.prototype);
Beam.prototype.constructor = Beam;

Beam.cost = {
    energy: 25,
    metal: 20
};
