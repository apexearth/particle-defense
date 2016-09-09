var Projectiles = require('../projectiles');
var Weapon = require('./Weapon');

module.exports = Missile;

function Missile(options) {
    Weapon.call(this, options);
    this.projectileSpeed = options.projectileSpeed;
    this.explosiveSpeed = options.explosiveSpeed;
    this.explosiveTime = options.explosiveTime;
    this.explosiveInitialSize = options.explosiveInitialSize;
    this.range = options.range;
    this.damage = options.damage;
    this.fireRate = options.fireRate;
    this.fireRateCount = options.fireRate;
    this.acceleration = options.acceleration;
    this.shotSpeedVariance = options.accuracy;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage / 1.5;
    };
    this.createProjectile = function () {
        return new Projectiles.Missile(this);
    };
}
Missile.prototype = Object.create(Weapon.prototype);
Missile.prototype.constructor = Missile;