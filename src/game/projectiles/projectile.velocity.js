var PIXI = require('pixi.js');
var Projectile = require('./projectile');

module.exports = VelocityProjectile;

function VelocityProjectile(options) {
    Projectile.call(this, options);

    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);

    this.lastPosition = this.position;
    this.width = Math.sqrt(this.damage) * 2 / this.initialVelocity * 3;
    this.projectileUpdate = this.update;
    this.update = function () {
        this.lastPosition = this.position.clone();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.projectileUpdate();

        this.graphics.clear();
        this.graphics.lineStyle(this.width, 0xFFFFFF, 1);
        this.graphics.moveTo(this.lastPosition.x - this.position.x, this.lastPosition.y - this.position.y);
        this.graphics.lineTo(0, 0);
    };
    this.hitTest = function (unit) {
        return unit.hitTestLine(this.position, this.lastPosition, this.width);
    };
}

VelocityProjectile.prototype = Object.create(Projectile.prototype);
VelocityProjectile.prototype.constructor = VelocityProjectile;
