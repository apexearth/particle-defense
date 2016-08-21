var PIXI = require('pixi.js')
var Projectile = require('./projectile')

module.exports = VelocityProjectile

function VelocityProjectile(weapon) {
    Projectile.call(this, weapon);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.lastPosition     = this.position;
    this.direction = weapon.getTargetLeadingAngle();
    this.initialVelocity = weapon.projectileSpeed;
    this.velocity.x = Math.cos(this.direction) * this.initialVelocity;
    this.velocity.y = Math.sin(this.direction) * this.initialVelocity;
    this.width = Math.sqrt(this.damage) * 2 / this.initialVelocity * 3;
    this.projectileUpdate = this.update;
    this.update           = function () {
        this.projectileUpdate();
        this.lastPosition = this.position.clone();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.graphics.clear();
        this.graphics.lineStyle(this.width, 0xFFFFFF, 1);
        this.graphics.moveTo(this.lastPosition.x - this.position.x, this.lastPosition.y - this.position.y);
        this.graphics.lineTo(0, 0);
    };
    this.hitTest          = function (unit) {
        return unit.hitTestLine(this.position, this.lastPosition, this.width);
    };
}

VelocityProjectile.prototype             = Object.create(PIXI.Container.prototype);
VelocityProjectile.prototype.constructor = VelocityProjectile;
