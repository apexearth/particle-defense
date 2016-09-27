var PIXI = require('pixi.js');
var Projectile = require('./Projectile');

module.exports = VelocityProjectile;

function VelocityProjectile(options) {
    Projectile.call(this, options);

    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);

    this.lastPosition = this.position;
    this.width = Math.sqrt(this.damage) * 2 / this.initialVelocity * 3;
    this.projectileUpdate = this.update;
    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        this.lastPosition = this.position.clone();
        this.position.x += this.velocity.x * seconds;
        this.position.y += this.velocity.y * seconds;
        this.projectileUpdate(seconds);

        this.graphics.clear();
        this.graphics.lineStyle(this.width, 0xFFFFFF, 1);
        this.graphics.moveTo(this.lastPosition.x - this.position.x, this.lastPosition.y - this.position.y);
        this.graphics.lineTo(0, 0);
    };
    this.hitTest = function (unit) {
        return unit.hitTestLine(this.position, this.lastPosition);
    };
}

VelocityProjectile.prototype = Object.create(Projectile.prototype);
VelocityProjectile.prototype.constructor = VelocityProjectile;
