var PIXI = require('pixi.js');
var VelocityProjectile = require('./projectile.velocity');

module.exports = AcceleratingProjectile;

function AcceleratingProjectile(weapon) {
    VelocityProjectile.call(this, weapon);
    this.acceleration = weapon.acceleration;
    this.velocityProjectileUpdate = this.update;
    this.update                   = function () {
        this.velocityProjectileUpdate();
        this.velocity.x += Math.cos(this.direction) * this.acceleration;
        this.velocity.y += Math.sin(this.direction) * this.acceleration;
    };
}

AcceleratingProjectile.prototype             = Object.create(PIXI.Container.prototype);
AcceleratingProjectile.prototype.constructor = AcceleratingProjectile;
