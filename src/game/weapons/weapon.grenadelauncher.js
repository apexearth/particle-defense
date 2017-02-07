const Projectiles = require('../projectiles');
const Gun = require('./weapon.gun');

module.exports = GrenadeLauncher;

function GrenadeLauncher(options) {
    var me = this;
    Gun.call(this, options);
    this.projectileClass = Projectiles.Grenade;
    this.projectileSlowFactor = options.projectileSlowFactor;
    this.explosiveSpeed = options.explosiveSpeed;
    this.explosiveTime = options.explosiveTime;
    this.explosiveInitialSize = options.explosiveInitialSize;
    this.gunAttributeCost = this.attributeCost;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 2 * (this.explosiveSpeed + this.explosiveTime + this.explosiveInitialSize / 20);
    };
    /** @return {number} **/
    this.attributeCost = function () {
        return me.gunAttributeCost() * (1 + (me.explosiveTime + me.explosiveSpeed + me.explosiveInitialSize / 20) / 5);
    };
}
GrenadeLauncher.prototype = Object.create(Gun.prototype);
GrenadeLauncher.prototype.constructor = GrenadeLauncher;
