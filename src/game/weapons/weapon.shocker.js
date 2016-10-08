var Projectiles = require('../projectiles');
var Weapon = require('./Weapon');

module.exports = Shocker;

function Shocker(options) {
    Weapon.call(this, options);
    this.lifespan = options.lifespan;
    this.range = options.range;
    this.damage = options.damage;
    this.fireRate = this.fireRateCount = options.fireRate;
    this.projectileClass = Projectiles.Shock;

    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 3 / this.lifespan;
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
Shocker.prototype = Object.create(Weapon.prototype);
Shocker.prototype.constructor = Shocker;
