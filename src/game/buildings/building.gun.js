const Images = require('../../img');
const weapons = require('../weapons');
const Building = require('./Building');

module.exports = Gun;

function Gun(options) {
    Building.call(this, options);
    this.name = 'Gun';
    this.container.addChild(Images.buildings.SmallPlatform());
    this.health = 5;
    this.addWeapon(new weapons.Gun({
        level: this.level,
        building: this,
        range: 150,
        fireRate: .5,
        damage: 5,
        projectileSpeed: 50,
        shotsPerShot: 1,
        accuracy: .94
    }));
}

Gun.prototype = Object.create(Building.prototype);
Gun.prototype.constructor = Gun;

Gun.cost = {
    energy: 20,
    metal: 10
};

Gun.tags = [
    'defense'
];