const AcceleratingProjectile = require('./projectile.accelerating');
const Explosion = require('./Explosion');
const math = require('../../util/math');

module.exports = MissileProjectile;

function MissileProjectile(weapon) {
    AcceleratingProjectile.call(this, weapon);
    Explosion.addExplosiveProperties(this, weapon);
    this.target = weapon.target;
    this.damage = weapon.damage;
    this.width = Math.sqrt(this.damage);
    this.explodeRange = this.width * 3;
    this.hitTest                          = function (unit) {
        return unit.hitTestLine(this.position, this.lastPosition);
    };
    this.inheritedUpdateMissileProjectile = this.update;
    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        if (this.target !== null) {
            if (this.target.dead) this.target = null;
            if (this.target !== null) {
                var expectedAverageVelocity = this.acceleration * math.distance(this.position.x - this.target.position.x, this.position.y - this.target.position.y) / 2 + this.currentVelocity;
                this.direction = math.leadingAngle(this.position.x, this.position.y, expectedAverageVelocity, this.target.position.x, this.target.position.y, this.target.velocity.x, this.target.velocity.y);
            }
        }
        this.inheritedUpdateMissileProjectile(seconds);
    };
}

MissileProjectile.prototype = Object.create(AcceleratingProjectile.prototype);
MissileProjectile.prototype.constructor = MissileProjectile;
