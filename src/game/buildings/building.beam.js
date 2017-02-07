const Images = require('../../img');
const Weapons = require('../weapons');
const Building = require('./Building');

module.exports = Beam;

function Beam(options) {
    Building.call(this, options);
    this.name = 'Beam';
    this.container.addChild(Images.buildings.SmallPlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Laser({
        level: this.level,
        building: this,
        range: 100,
        lifespan: 1,
        damage: .05,
        fireRate: .3,
        accuracy: .95
    }));
}

Beam.prototype = Object.create(Building.prototype);
Beam.prototype.constructor = Beam;

Beam.cost = {
    energy: 25,
    metal: 20
};

Beam.tags = [
    'defense'
];
