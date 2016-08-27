var Projectiles = require('../projectiles');
var Weapon = require('./Weapon');

module.exports = Shocker;

function Shocker(options) {
    Weapon.call(this, options);
    this.name = this.constructor.name;
    this.lifespan = options.lifeSpan;
    this.range = options.range;
    this.damage = options.damage;
    this.fireRate = this.fireRateCount = options.fireRate;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 3 / this.lifespan;
    };
    this.createProjectile = function () {
        return new Projectiles.Shock(this);
    };
}
Shocker.prototype = Object.create(Weapon.prototype);
Shocker.prototype.constructor = Shocker;
