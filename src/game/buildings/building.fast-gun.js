const Images = require('../../img');
const Weapons = require('../weapons');
const Building = require('./Building');

module.exports = FastGun;

function FastGun(options) {
    Building.call(this, options);
    this.name = 'FastGun';
    this.container.addChild(Images.buildings.EnergyFab());
    this.health = 5;
    this.addWeapon(new Weapons.Gun({
        level: this.level,
        building: this,
        range: 100,
        fireRate: .25,
        damage: 3,
        projectileSpeed: 65,
        shotsPerShot: 1,
        accuracy: .94
    }));
}

FastGun.prototype = Object.create(Building.prototype);
FastGun.prototype.constructor = FastGun;

FastGun.cost = {
    energy: 30,
    metal: 15
};

FastGun.tags = [
    'defense'
];
