var PIXI               = require("pixi.js")
var VelocityProjectile = require("./projectile.velocity")

module.exports = AcceleratingProjectile

function AcceleratingProjectile(weapon) {
    VelocityProjectile.call(this, weapon);
    this.Acceleration             = weapon.Acceleration;
    this.velocityProjectileUpdate = this.update;
    this.update                   = function () {
        this.velocityProjectileUpdate();
        this.VelocityX += Math.cos(this.Direction) * this.Acceleration;
        this.VelocityY += Math.sin(this.Direction) * this.Acceleration;
    };
}

AcceleratingProjectile.prototype             = Object.create(PIXI.Container.prototype);
AcceleratingProjectile.prototype.constructor = AcceleratingProjectile;
