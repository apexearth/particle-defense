var Projectiles = require('../projectiles');
var Gun = require('./weapon.gun');

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
    this.createAttributeForStat('explosiveSpeed', true, 4, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveTime', true, 10, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveInitialSize', true, 30, 1.1, this.attributeCost);
}
GrenadeLauncher.prototype = Object.create(Gun.prototype);
GrenadeLauncher.prototype.constructor = GrenadeLauncher;
