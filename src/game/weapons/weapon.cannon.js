var Projectiles = require('../projectiles');
var Gun = require('./weapon.gun');

module.exports = Cannon;

function Cannon(options) {
    Gun.call(this, options);
    this.name = this.constructor.name;
    this.projectileClass = Projectiles.Cannon;
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
        return this.gunAttributeCost() * (1 + (this.explosiveTime + this.explosiveSpeed + this.explosiveInitialSize / 20) / 5);
    };
    this.createAttributeForStat('explosiveSpeed', true, 4, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveTime', true, 10, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveInitialSize', true, 30, 1.1, this.attributeCost);
}
Cannon.prototype = Object.create(Gun.prototype);
Cannon.prototype.constructor = Cannon;
