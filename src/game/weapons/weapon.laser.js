var Projectiles = require('../projectiles');
var Weapon = require('./Weapon');

module.exports = Laser;

function Laser(options) {
    Weapon.call(this, options);
    this.lifespan = options.lifeSpan;
    this.range = options.range;
    this.damage = options.damage;
    this.fireRate = options.fireRate;
    this.fireRateCount = options.fireRate;
    this.accuracy = 1 - options.accuracy;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 3 / this.lifespan;
    };
    this.createProjectile = function () {
        return new Projectiles.Laser(this);
    };
}
Laser.prototype = Object.create(Weapon.prototype);
Laser.prototype.constructor = Laser;
