const Weapons = require('../weapons');
const Images = require('../../img');
const Building = require('./Building');

module.exports = Laser;

function Laser(options) {
    Building.call(this, options);
    this.name = 'Laser';
    this.container.addChild(Images.buildings.Platform());
    this.health = 5;
    this.addWeapon(new Weapons.Laser({
        level: this.level,
        building: this,
        range: 100,
        lifespan: 60,
        damage: 4,
        fireRate: .75,
        accuracy: .95
    }));
}

Laser.prototype = Object.create(Building.prototype);
Laser.prototype.constructor = Laser;

Laser.cost = {
    energy: 50,
    metal: 25
};

Laser.tags = [
    'defense'
];
