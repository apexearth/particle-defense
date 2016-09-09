var Projectiles = require('../projectiles');
var Weapon = require('./Weapon');

module.exports = Gun;

function Gun(options) {
    Weapon.call(this, options);
    var me = this;
    this.range = options.range;
    this.fireRate = options.fireRate;
    this.fireRateCount = options.fireRate;
    this.projectileSpeed = options.projectileSpeed;
    this.damage = options.damage;
    this.accuracy = 1 - options.accuracy;
    this.shotsPerShot = options.shotsPerShot;
    this.projectileClass = Projectiles.Bullet;
    this.weaponAttributeCost = this.attributeCost;

    /** @return {number} **/
    this.attributeCost = function () {
        return me.weaponAttributeCost() * (1 + me.projectileSpeed / 5);
    };
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage / 2 * this.projectileSpeed / 3;
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
Gun.prototype = Object.create(Weapon.prototype);
Gun.prototype.constructor = Gun;
