/// <reference path="~/Game/Weapon.js" />
function Projectile(level, x, y, direction, speed, damage) {
    this.Level = level;
    this.X = x;
    this.Y = y;
    this.Direction = direction;
    this.Speed = speed;
    this.Damage = damage;
    this.Radius = 1;
    this.onHit = function () { this.Level.Projectiles.splice(this.Level.Projectiles.indexOf(this), 1); }
}

Projectile.prototype.draw = function (context) {
    context.fillStyle = '#aaa';
    context.fillRect(this.X - 1, this.Y - 1, 2, 2);
};

Projectile.prototype.update = function () {
    this.X += Math.cos(this.Direction) * this.Speed;
    this.Y += Math.sin(this.Direction) * this.Speed;

    if (!this.Level.hitTest(this)) // Die if outside of level.
    {
        this.onHit();
    }
    else {
        var u = this.Level.Units.length;
        while (u--) {
            var unit = this.Level.Units[u];
            if (unit.hitTest(this)) {
                unit.damage(this.Damage);
                if (this.onHit != null) this.onHit();
            }
        }
    }
}