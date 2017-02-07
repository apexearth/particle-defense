const VelocityProjectile = require('./projectile.velocity');
const Explosion = require('./Explosion');

module.exports = CannonProjectile;

function CannonProjectile(weapon) {
    VelocityProjectile.call(this, weapon);
    Explosion.addExplosiveProperties(this, weapon);
}

CannonProjectile.prototype = Object.create(VelocityProjectile.prototype);
CannonProjectile.prototype.constructor = CannonProjectile;
