/// <reference path="~/Game/Level.js" />
/// <reference path="~/Game/Projectile.js" />
/// <reference path="~/Game/Buildings/Building.js" />
/// <reference path="~/util/General.js" />
function Weapon(building) {
    this.Building = building;
    this.Range = 200;
    this.Damage = 4;
    this.ProjectileSpeed = 3;
    this.AmmoConsumption = 1;
    this.Interval = 10;
    this.IntervalCount = 10;
    this.ResetTarget = function () {
        this.Target = null;
        this.TargetLastX = null;
        this.TargetLastY = null;
    }
    this.ResetTarget();
}

Weapon.prototype.update = function () {
    if (this.Target != null && this.Target.Health <= 0) {
        this.ResetTarget();
    }
    if (this.Target == null) {
        var i = this.Building.Level.Units.length;
        while (i--) {
            var unit = this.Building.Level.Units[i];
            if (General.Distance(unit.X - this.Building.X, unit.Y - this.Building.Y) < this.Range) {
                this.Target = unit;
            }
        }
    }

    if (this.Target != null && this.TargetLastX == null) {
        this.TargetLastX = this.Target.X;
        this.TargetLastY = this.Target.Y;
    }
    if (this.IntervalCount < this.Interval) this.IntervalCount++;
    if (this.Target != null
        && this.IntervalCount >= this.Interval
        && this.Building.Player.Resources.Ammo >= this.AmmoConsumption) {

        var velocityX = this.Target.VelocityX;
        var velocityY = this.Target.VelocityY;
        var a = Math.pow(velocityX, 2) + Math.pow(velocityY, 2) - Math.pow(this.ProjectileSpeed, 2);
        var b = 2 * (velocityX * (this.Target.X - this.Building.X) + velocityY * (this.Target.Y - this.Building.Y));
        var c = Math.pow(this.Target.X - this.Building.X, 2) + Math.pow(this.Target.Y - this.Building.Y, 2);
        var disc = Math.pow(b, 2) - 4 * a * c;
        if (disc < 0) this.ResetTarget();
        else {
            var t1 = (-b + Math.sqrt(disc)) / (2 * a);
            var t2 = (-b - Math.sqrt(disc)) / (2 * a);
            var t = (t1 < t2 && t1 > 0 ? t1 : t2);
            var aimTargetX = t * velocityX + this.Target.X;
            var aimTargetY = t * velocityY + this.Target.Y;
            var angle = General.AngleRad(this.Building.X, this.Building.Y, aimTargetX, aimTargetY);
            var projectile = new Projectile(
                this.Building.Level,
                this.Building.X,
                this.Building.Y,
                angle,
                this.ProjectileSpeed,
                this.Damage
            );
            this.Building.Player.Resources.Ammo -= this.AmmoConsumption;
            this.IntervalCount = 0;
            this.Building.Level.Projectiles.push(projectile);
        }
    }
    if (this.Target != null) {
        this.TargetLastX = this.Target.X;
        this.TargetLastY = this.Target.Y;
    }
};
