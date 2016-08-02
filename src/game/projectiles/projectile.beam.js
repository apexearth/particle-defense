var PIXI       = require("pixi.js")
var Projectile = require("./projectile")
var math       = require("../../util/math")

module.exports = BeamProjectile

function BeamProjectile(weapon) {
    Projectile.call(this, weapon);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.Lifespan      = weapon.Lifespan;
    this.FadeTime      = weapon.Lifespan / 2;
    this.FadeTimeCount = 0;
    this.Damage        = weapon.Damage / weapon.Lifespan;
    this.Width         = Math.max(1, this.Damage * 10);
    this.Direction     = weapon.getTargetAngle();
    this.EndX          = this.position.x + Math.cos(this.Direction) * this.Weapon.Range;
    this.EndY          = this.position.y + Math.sin(this.Direction) * this.Weapon.Range;

    this.graphics.lineStyle(this.Width, 0xAAAAFF, .35);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(Math.cos(this.Direction) * this.Weapon.Range, Math.sin(this.Direction) * this.Weapon.Range);

    /** @returns Number */
    this.EffectiveDamage = function (unit) {
        return this.Damage * math.Distance(this.position.x - unit.x, this.position.y - unit.y) / this.Weapon.Range;
    };

    this.projectileUpdate = this.update;
    this.update           = function () {
        if (this.LifespanCount > this.Lifespan - this.FadeTime) this.FadeTimeCount++;
        this.projectileUpdate();
        this.alpha = Math.max(1, this.FadeTime - this.FadeTimeCount) / (this.FadeTime / 2);
    };
    this.onHit            = function () {
        // Nothing
    };
    this.hitTest          = function (unit) {
        return unit.hitTestLine({x: this.position.x, y: this.position.y}, {
            x: this.EndX,
            y: this.EndY
        }, this.Width);
    };

}

BeamProjectile.prototype             = Object.create(PIXI.Container.prototype);
BeamProjectile.prototype.constructor = BeamProjectile;
