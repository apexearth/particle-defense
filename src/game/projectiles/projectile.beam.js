var PIXI = require('pixi.js');
var Projectile = require('./projectile');
var math = require('../../util/math');

module.exports = BeamProjectile;

function BeamProjectile(weapon) {
    Projectile.call(this, weapon);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);
    
    this.lifespan = weapon.lifespan;
    this.fadeTime = weapon.lifespan / 2;
    this.fadeTimeCount = 0;
    this.damage = weapon.damage / weapon.lifespan;
    this.width = Math.max(1, this.damage * 10);
    this.direction = weapon.getTargetAngle();
    this.endX = this.position.x + Math.cos(this.direction) * this.weapon.range;
    this.endY = this.position.y + Math.sin(this.direction) * this.weapon.range;
    
    this.graphics.lineStyle(this.width, 0xAAAAFF, .35);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(Math.cos(this.direction) * this.weapon.range, Math.sin(this.direction) * this.weapon.range);

    /** @returns Number */
    this.effectiveDamage = function (unit) {
        return this.damage * math.distance(this.position.x - unit.x, this.position.y - unit.y) / this.weapon.range;
    };

    this.projectileUpdate = this.update;
    this.update           = function () {
        if (this.lifespanCount > this.lifespan - this.fadeTime) this.fadeTimeCount++;
        this.projectileUpdate();
        this.alpha = Math.max(1, this.fadeTime - this.fadeTimeCount) / (this.fadeTime / 2);
    };
    this.onHit            = function () {
        // Nothing
    };
    this.hitTest          = function (unit) {
        return unit.hitTestLine({x: this.position.x, y: this.position.y}, {
            x: this.endX,
            y: this.endY
        }, this.Width);
    };

}

BeamProjectile.prototype             = Object.create(PIXI.Container.prototype);
BeamProjectile.prototype.constructor = BeamProjectile;
