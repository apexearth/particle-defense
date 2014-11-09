define(["../PIXI","./projectile", "util/General"], function (PIXI, Projectile, General) {
    function BeamProjectile(weapon) {
        Projectile.call(this, weapon);
        this.Lifespan = weapon.Lifespan;
        this.FadeTime = weapon.Lifespan / 2;
        this.FadeTimeCount = 0;
        this.Damage = weapon.Damage / weapon.Lifespan;
        this.Width = weapon.Damage * 10 / weapon.Lifespan;
        this.Direction = weapon.getTargetAngle();
        this.EndX = this.position.x + Math.cos(this.Direction) * this.Weapon.Range;
        this.EndY = this.position.y + Math.sin(this.Direction) * this.Weapon.Range;
        /** @returns Number */
        this.EffectiveDamage = function (unit) {
            return this.Damage * General.Distance(this.position.x - unit.x, this.position.y - unit.y) / this.Weapon.Range;
        };

        this.projectileUpdate = this.update;
        this.update = function () {
            if (this.LifespanCount > this.Lifespan - this.FadeTime) this.FadeTimeCount++;
            this.projectileUpdate();
        };
        this.onHit = function () {
            // Nothing
        };
        this.hitTest = function (unit) {
            return unit.hitTestLine({x: this.position.x, y: this.position.y}, {
                x: this.EndX,
                y: this.EndY
            }, this.Width);
        };

        this.draw = function (context) {
            context.save();
            context.globalAlpha = Math.max(1, this.FadeTime - this.FadeTimeCount) / (this.FadeTime / 2);
            var grad = context.createLinearGradient(this.position.x, this.position.y, this.EndX, this.EndY);
            grad.addColorStop(0, '#77f');
            grad.addColorStop(1, '#227');
            context.strokeStyle = grad;
            context.lineWidth = this.Width;
            context.lineCap = "square";
            context.beginPath();
            context.moveTo(this.position.x, this.position.y);
            context.lineTo(this.EndX, this.EndY);
            context.stroke();
            context.closePath();
            context.restore();
        };
    }

    BeamProjectile.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    BeamProjectile.prototype.constructor = BeamProjectile;
    return BeamProjectile;
});
