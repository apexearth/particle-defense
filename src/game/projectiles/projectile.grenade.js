var ThrownProjectile = require('./projectile.thrown');
var Explosion = require('./Explosion');

module.exports = GrenadeProjectile;

function GrenadeProjectile(weapon) {
    ThrownProjectile.call(this, weapon);
    Explosion.addExplosiveProperties(this, weapon);
}

GrenadeProjectile.prototype = Object.create(ThrownProjectile.prototype);
GrenadeProjectile.prototype.constructor = GrenadeProjectile;
