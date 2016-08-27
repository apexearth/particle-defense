var Weapons = require('../weapons');
var Images = require('../../img');
var Building = require('./building');

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
        lifeSpan: 60,
        damage: 4,
        fireRate: 45,
        accuracy: .95
    }));
}

Laser.prototype = Object.create(Building.prototype);
Laser.prototype.constructor = Laser;

Laser.cost = {
    energy: 50,
    metal: 25
};
