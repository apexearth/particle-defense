define(["../PIXI","./projectile.velocity"], function (PIXI, VelocityProjectile) {
    function AcceleratingProjectile(weapon) {
        VelocityProjectile.call(this, weapon);
        this.Acceleration = weapon.Acceleration;
        this.velocityProjectileUpdate = this.update;
        this.update = function () {
            this.velocityProjectileUpdate();
            this.VelocityX += Math.cos(this.Direction) * this.Acceleration;
            this.VelocityY += Math.sin(this.Direction) * this.Acceleration;
        };
    }

    AcceleratingProjectile.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    AcceleratingProjectile.prototype.constructor = AcceleratingProjectile;
    return AcceleratingProjectile;
});