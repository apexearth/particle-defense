var PIXI       = require("pixi.js")
var Projectile = require("./projectile")
var math       = require("../../util/math")

module.exports = ThrownProjectile

function ThrownProjectile(weapon) {
    Projectile.call(this, weapon);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.lastPosition         = this.position;
    this.Target               = weapon.getTargetLeadingVector();
    this.InitialDistance      = math.Distance(this.position.x - this.Target.x, this.position.y - this.Target.y);
    this.Direction            = math.angle(this.position.x, this.position.y, this.Target.x, this.Target.y);
    this.InitialVelocity      = weapon.ProjectileSpeed;
    this.CurrentVelocity      = weapon.ProjectileSpeed;
    this.ProjectileSlowFactor = weapon.ProjectileSlowFactor;
    this.projectileUpdate     = this.update;
    this.update               = function () {
        this.projectileUpdate();
        this.lastPosition = this.position.clone();
        if (this.Distance == null || this.Distance > this.Width) {
            this.Distance        = math.Distance(this.position.x - this.Target.x, this.position.y - this.Target.y);
            this.CurrentVelocity = this.InitialVelocity * (Math.pow(this.Distance + 25, this.ProjectileSlowFactor) * 2 / Math.pow(this.InitialDistance, this.ProjectileSlowFactor));
            this.VelocityX       = Math.cos(this.Direction) * this.CurrentVelocity;
            this.VelocityY       = Math.sin(this.Direction) * this.CurrentVelocity;
            this.position.x += this.VelocityX;
            this.position.y += this.VelocityY;
        }
        this.graphics.clear();
        this.graphics.lineStyle(this.Width, 0xFFFFFF, .5);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(this.lastPosition.x - this.position.x, this.lastPosition.y - this.position.y);
        this.graphics.lineStyle(0, 0xFFFFFF, 0);
        this.graphics.beginFill(0xFFFFFF, 1);
        this.graphics.drawRect(0, 0, this.Width, this.Width);
        this.graphics.endFill();
    };
    this.hitTest              = function (unit) {
        if (this.position.x - this.lastPosition.x > 1 && this.position.y - this.lastPosition.y > 1) {
            return unit.hitTestLine(this.position, this.lastPosition, this.Width);
        } else {
            return unit.hitTest(this, this.Width);
        }
    };
}

ThrownProjectile.prototype             = Object.create(PIXI.Container.prototype);
ThrownProjectile.prototype.constructor = ThrownProjectile;
