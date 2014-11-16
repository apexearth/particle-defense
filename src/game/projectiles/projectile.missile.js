define(["../PIXI", "./projectile.accelerating", "./explosion", "../../util/math!"],
    function (PIXI, AcceleratingProjectile, Explosion, math) {
        function MissileProjectile(weapon) {
            AcceleratingProjectile.call(this, weapon);
            Explosion.addExplosiveProperties(this, weapon);
            this.Target = weapon.Target;
            this.Damage = weapon.Damage;
            this.Width = Math.sqrt(this.Damage);
            this.ExplodeRange = this.Width * 3;
            this.hitTest = function (unit) {
                return unit.hitTestLine(this.position, this.lastPosition, this.ExplodeRange);
            };
            this.inheritedUpdateMissileProjectile = this.update;
            this.update = function () {
                if (this.Target !== null) {
                    if (this.Target.IsDead) this.Target = null;
                    if (this.Target !== null) {
                        var expectedAverageVelocity = this.Acceleration * math.Distance(this.position.x - this.Target.x, this.position.y - this.Target.y) / 2 + this.CurrentVelocity;
                        this.Direction = math.leadingAngle(this.position.x, this.position.y, expectedAverageVelocity, this.Target.x, this.Target.y, this.Target.VelocityX, this.Target.VelocityY);
                    }
                }
                this.inheritedUpdateMissileProjectile();
            };
        }

        MissileProjectile.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
        MissileProjectile.prototype.constructor = MissileProjectile;
        return MissileProjectile;
    });