﻿/// <reference path="~/Game/Weapon.js" />
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
    context.drawRect(this.X, this.X, 1, 1);
};

Projectile.prototype.update = function () {
    this.X += Math.cos(this.Direction) * this.Speed;
    this.Y += Math.sin(this.Direction) * this.Speed;
    var u = this.Level.Units.length;
    while (u--) {
        var unit = this.Level.Units[u];
        if (unit.hitTest(this)) {
            unit.damage(this.Damage);
            if (this.onHit != null) this.onHit();
        }
    }
}