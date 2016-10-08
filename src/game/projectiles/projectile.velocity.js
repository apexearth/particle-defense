var PIXI = require('pixi.js');
var Projectile = require('./Projectile');

module.exports = VelocityProjectile;

function VelocityProjectile(options) {
    Projectile.call(this, options);
    if (!options.velocity) throw new Error('VelocityProjectile requires a velocity option to be created.');

    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.container.rotation = this.direction;

    this.initialVelocity = options.velocity;
    this.velocity = {
        x: Math.cos(this.direction) * this.initialVelocity,
        y: Math.sin(this.direction) * this.initialVelocity
    };

    this.lastPosition = this.position;
    this.width = this.damage / this.initialVelocity * 30;

    this.graphics.lineStyle(this.width, 0xAAAAFF, .35);
    this.graphics.drawRect(-this.width / 2, -this.width / 2, this.width, this.width);

    this.projectileUpdate = this.update;
    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        this.lastPosition = this.position.clone();
        this.position.x += this.velocity.x * seconds;
        this.position.y += this.velocity.y * seconds;
        this.projectileUpdate(seconds);
    };
    this.hitTest = function (unit) {
        return unit.hitTestLine(this.position, this.lastPosition);
    };
}

VelocityProjectile.prototype = Object.create(Projectile.prototype);
VelocityProjectile.prototype.constructor = VelocityProjectile;
