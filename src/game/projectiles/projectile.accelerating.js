const VelocityProjectile = require('./projectile.velocity');

module.exports = AcceleratingProjectile;

function AcceleratingProjectile(weapon) {
    VelocityProjectile.call(this, weapon);
    this.acceleration = weapon.acceleration;
    this.velocityProjectileUpdate = this.update;
    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        this.velocityProjectileUpdate(seconds);
        this.velocity.x += Math.cos(this.direction) * this.acceleration * seconds;
        this.velocity.y += Math.sin(this.direction) * this.acceleration * seconds;
    };
}

AcceleratingProjectile.prototype = Object.create(VelocityProjectile.prototype);
AcceleratingProjectile.prototype.constructor = AcceleratingProjectile;
