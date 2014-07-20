/// <reference path="~/Game/Level.js" />
/// <reference path="~/Game/Projectile.js" />
/// <reference path="~/Game/Buildings/Building.js" />
/// <reference path="~/util/General.js" />
function Weapon(building) {
    this.Building = building;
    this.Range = 200;
    this.Damage = 1;
    this.ProjectileSpeed = 3;
    this.Interval = 10;
    this.IntervalCount = 10;
    this.Target = null;
}

Weapon.prototype.update = function () {
    if (this.Target != null && this.Target.Health <= 0) this.Target = null;
    if (this.Target == null) {
        var i = this.Building.Level.Units.length;
        while (i--) {
            var unit = this.Building.Level.Units[i];
            var distance = General.Distance(unit.X - this.Building.X, unit.Y - this.Building.Y);
            if (distance < this.Range) {
                this.Target = unit;
            }
        }
    }

    if (this.IntervalCount < this.Interval) this.IntervalCount++;
    if (this.Target != null
        && this.IntervalCount >= this.Interval) {
        var projectile = new Projectile(
            this.Building.Level,
            this.Building.X,
            this.Building.Y,
            General.AngleRad(this.Building.X, this.Building.Y, this.Target.X, this.Target.Y),
            this.ProjectileSpeed,
            this.Damage
        );
        this.IntervalCount = 0;
        this.Building.Level.Projectiles.push(projectile);
    }
};
