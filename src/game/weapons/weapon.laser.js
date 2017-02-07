const Projectiles = require('../projectiles');
const Weapon = require('./Weapon');

module.exports = Laser;

function Laser(options) {
    Weapon.call(this, options);
    this.lifespan = options.lifespan;
    this.fadeTime = options.lifespan / 2;
    this.range = options.range;
    this.damage = options.damage;
    this.fireRate = options.fireRate;
    this.fireRateCount = options.fireRate;
    this.accuracy = 1 - options.accuracy;
    this.projectileClass = Projectiles.Laser;

    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 3 / this.lifespan;
    };
    this.createProjectile = function () {
        return new this.projectileClass({
            level: this.level,
            player: this.player,
            lifespan: this.lifespan,
            fadeTime: this.fadeTime,
            direction: this.rotation,
            position: this.position,
            range: this.range,
            damage: this.damage
        });
    };
}
Laser.prototype = Object.create(Weapon.prototype);
Laser.prototype.constructor = Laser;
