const PIXI = require('pixi.js');
const Projectile = require('./Projectile');
const math = require('../../util/math');

module.exports = BeamProjectile;

function BeamProjectile(options) {
    Projectile.call(this, options);

    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);

    this.lifespan = options.lifespan;
    this.fadeTime = options.lifespan / 2;
    this.fadeTimeCount = 0;
    this.damage = options.damage / options.lifespan;
    this.width = Math.max(1, this.damage * 10);
    this.endX = this.position.x + Math.cos(options.direction) * options.range;
    this.endY = this.position.y + Math.sin(options.direction) * options.range;
    
    this.graphics.lineStyle(this.width, 0xAAAAFF, .35);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(Math.cos(this.direction) * options.range, Math.sin(this.direction) * options.range);

    /** @returns Number */
    this.effectiveDamage = function (unit) {
        return this.damage * math.distance(this.position.x - unit.position.x, this.position.y - unit.position.y) / options.range;
    };

    this.projectileUpdate = this.update;
    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        if (this.lifespanCount > this.lifespan - this.fadeTime) this.fadeTimeCount += seconds;
        this.projectileUpdate(seconds);
        this.container.alpha = Math.max(1, this.fadeTime - this.fadeTimeCount) / (this.fadeTime / 2);
    };
    this.onHit            = function () {
        // Nothing
    };
    this.hitTest          = function (unit) {
        return unit.hitTestLine({x: this.position.x, y: this.position.y}, {
            x: this.endX,
            y: this.endY
        }, this.width);
    };

}

BeamProjectile.prototype = Object.create(Projectile.prototype);
BeamProjectile.prototype.constructor = BeamProjectile;
