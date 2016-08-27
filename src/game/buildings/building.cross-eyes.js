var Images = require('../../img');
var Weapons = require('../weapons');
var Building = require('./building');

module.exports = CrossEyes;

function CrossEyes(options) {
    Building.call(this, options);
    this.name = 'CrossEyes';
    this.container.addChild(Images.buildings.SmallPlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Gun({
        level: this.level,
        building: this,
        range: 150,
        fireRate: 13,
        damage: 8,
        projectileSpeed: 6,
        shotsPerShot: 2,
        accuracy: .9
    }));
}

CrossEyes.prototype = Object.create(Building.prototype);
CrossEyes.prototype.constructor = CrossEyes;

CrossEyes.cost = {
    energy: 35,
    metal: 20
};
