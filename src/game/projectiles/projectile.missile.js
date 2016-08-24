var PIXI = require('pixi.js');
var AcceleratingProjectile = require('./projectile.accelerating');
var Explosion = require('./explosion');
var math = require('../../util/math');

module.exports = MissileProjectile;

function MissileProjectile(weapon) {
    AcceleratingProjectile.call(this, weapon);
    Explosion.addExplosiveProperties(this, weapon);
    this.target = weapon.target;
    this.damage = weapon.damage;
    this.width = Math.sqrt(this.damage);
    this.explodeRange = this.width * 3;
    this.hitTest                          = function (unit) {
        return unit.hitTestLine(this.position, this.lastPosition, this.explodeRange);
    };
    this.inheritedUpdateMissileProjectile = this.update;
    this.update                           = function () {
        if (this.target !== null) {
            if (this.target.dead) this.target = null;
            if (this.target !== null) {
                var expectedAverageVelocity = this.acceleration * math.distance(this.position.x - this.target.x, this.position.y - this.target.y) / 2 + this.currentVelocity;
                this.direction = math.leadingAngle(this.position.x, this.position.y, expectedAverageVelocity, this.target.x, this.target.y, this.target.velocity.x, this.target.velocity.y);
            }
        }
        this.inheritedUpdateMissileProjectile();
    };
}

MissileProjectile.prototype             = Object.create(PIXI.Container.prototype);
MissileProjectile.prototype.constructor = MissileProjectile;
