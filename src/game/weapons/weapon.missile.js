const Projectiles = require('../projectiles');
const Weapon = require('./Weapon');

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
    this.projectileClass = Projectiles.Missile;

    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage / 1.5;
    };
    this.createProjectile = function () {
        return new this.projectileClass({
            level: this.level,
            player: this.player,
            direction: this.rotation,
            position: this.position,
            velocity: this.projectileSpeed,
            damage: this.damage
        });
    };
}
Missile.prototype = Object.create(Weapon.prototype);
Missile.prototype.constructor = Missile;