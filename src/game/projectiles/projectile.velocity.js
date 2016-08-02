var PIXI       = require("pixi.js")
var Projectile = require("./projectile")

module.exports = VelocityProjectile

function VelocityProjectile(weapon) {
    Projectile.call(this, weapon);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.lastPosition     = this.position;
    this.Direction        = weapon.getTargetLeadingAngle();
    this.InitialVelocity  = weapon.ProjectileSpeed;
    this.VelocityX        = Math.cos(this.Direction) * this.InitialVelocity;
    this.VelocityY        = Math.sin(this.Direction) * this.InitialVelocity;
    this.Width            = Math.sqrt(this.Damage) * 2 / this.InitialVelocity * 3;
    this.projectileUpdate = this.update;
    this.update           = function () {
        this.projectileUpdate();
        this.lastPosition = this.position.clone();
        this.position.x += this.VelocityX;
        this.position.y += this.VelocityY;

        this.graphics.clear();
        this.graphics.lineStyle(this.Width, 0xFFFFFF, 1);
        this.graphics.moveTo(this.lastPosition.x - this.position.x, this.lastPosition.y - this.position.y);
        this.graphics.lineTo(0, 0);
    };
    this.hitTest          = function (unit) {
        return unit.hitTestLine(this.position, this.lastPosition, this.Width);
    };
}

VelocityProjectile.prototype             = Object.create(PIXI.Container.prototype);
VelocityProjectile.prototype.constructor = VelocityProjectile;
