var VelocityProjectile = require('./projectile.velocity');
var Explosion = require('./explosion');

module.exports = CannonProjectile;

function CannonProjectile(weapon) {
    VelocityProjectile.call(this, weapon);
    Explosion.addExplosiveProperties(this, weapon);
}

CannonProjectile.prototype = Object.create(VelocityProjectile.prototype);
CannonProjectile.prototype.constructor = CannonProjectile;
