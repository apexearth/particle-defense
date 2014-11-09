define(["../PIXI","./projectile", "util/General"], function (PIXI, Projectile, General) {
    function ThrownProjectile(weapon) {
        Projectile.call(this, weapon);
        this.lastPosition = this.position;
        this.Target = weapon.getTargetLeadingVector();
        this.InitialDistance = General.Distance(this.position.x - this.Target.x, this.position.y - this.Target.y);
        this.Direction = General.AngleRad(this.position.x, this.position.y, this.Target.x, this.Target.y);
        this.InitialVelocity = weapon.ProjectileSpeed;
        this.CurrentVelocity = weapon.ProjectileSpeed;
        this.ProjectileSlowFactor = weapon.ProjectileSlowFactor;
        this.projectileUpdate = this.update;
        this.update = function () {
            this.projectileUpdate();
            this.lastPosition = this.position;
            if (this.Distance == null || this.Distance > this.Width) {
                this.Distance = General.Distance(this.position.x - this.Target.x, this.position.y - this.Target.y);
                this.CurrentVelocity = this.InitialVelocity * (Math.pow(this.Distance + 25, this.ProjectileSlowFactor) * 2 / Math.pow(this.InitialDistance, this.ProjectileSlowFactor));
                this.VelocityX = Math.cos(this.Direction) * this.CurrentVelocity;
                this.VelocityY = Math.sin(this.Direction) * this.CurrentVelocity;
                this.position.x += this.VelocityX;
                this.position.y += this.VelocityY;
            }
        };
        this.hitTest = function (unit) {
            if (this.position.x !== this.lastPosition.x && this.position.y !== this.lastPosition.y) {
                return unit.hitTestLine(this.position, this.lastPosition, this.Width);
            } else {
                return unit.hitTest(this);
            }
        };
    }

    ThrownProjectile.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    ThrownProjectile.prototype.constructor = ThrownProjectile;
    return ThrownProjectile;
});