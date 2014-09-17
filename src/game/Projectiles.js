define("game/Projectiles", ["game/Settings", "util/General"], function (Settings, General) {
    function Projectile(weapon) {
        this.Level = weapon.Building.Level;
        this.Building = weapon.Building;
        this.Weapon = weapon;
        this.X = this.Building.X;
        this.Y = this.Building.Y;
        this.Damage = 1;
        this.Width = 1;
        this.Lifespan = Settings.Second * 60;
        this.LifespanCount = 0;
        this.IsDead = false;

        this.die = function () {
            this.IsDead = true;
            this.Level.Projectiles.splice(this.Level.Projectiles.indexOf(this), 1);
        };
        this.onHit = function () {
            this.die();
        };

        this.draw = function (context) {
            context.fillStyle = '#aaa';
            context.fillRect(this.X - 1, this.Y - 1, 2, 2);
        };

        this.update = function () {
            if (this.LifespanCount++ > this.Lifespan) this.die();
            if (!this.Level.hitTest(this)) // Die if outside of level.
            {
                this.onHit();
            } else {
                this.unitHitCheck();
            }
        };
        this.hitTest = function (unit) {
            return unit.hitTest(this);
        };
        this.unitHitCheck = function () {
            var u = this.Level.Units.length;
            while (u--) {
                var unit = this.Level.Units[u];
                if (this.hitTest(unit)) {
                    unit.damage(this.Damage);
                    this.onHit();
                }
            }
        };
    }

    function VelocityProjectile(weapon, direction, initialVelocity) {
        Projectile.call(this, weapon);
        this.LastX = this.X;
        this.LastY = this.Y;
        this.Direction = direction;
        this.VelocityX = Math.cos(this.Direction) * initialVelocity;
        this.VelocityY = Math.sin(this.Direction) * initialVelocity;
        this.projectileUpdate = this.update;
        this.update = function () {
            this.projectileUpdate();
            this.LastX = this.X;
            this.LastY = this.Y;
            this.X += this.VelocityX;
            this.Y += this.VelocityY;
            this.EndX = this.X + Math.cos(this.Direction) * this.Length;
            this.EndY = this.Y + Math.sin(this.Direction) * this.Length;
        };
        this.hitTest = function (unit) {
            return unit.hitTestLine({X: this.X, Y: this.Y}, {X: this.LastX, Y: this.LastY}, this.Width);
        };
    }

    function AcceleratingProjectile(weapon, direction, initialVelocity, acceleration) {
        VelocityProjectile.call(this, weapon, direction, initialVelocity);
        this.Acceleration = acceleration;
        this.velocityProjectileUpdate = this.update;
        this.update = function () {
            this.velocityProjectileUpdate();
            this.VelocityX += Math.cos(this.Direction) * this.Acceleration;
            this.VelocityY += Math.sin(this.Direction) * this.Acceleration;
        };
    }

    function BeamProjectile(weapon, direction) {
        Projectile.call(this, weapon);
        this.Lifespan = Settings.Second;
        this.FadeTime = this.Lifespan / 2;
        this.FadeTimeCount = 0;
        this.Direction = direction;
        this.EndX = this.X + Math.cos(this.Direction) * this.Weapon.Range;
        this.EndY = this.Y + Math.sin(this.Direction) * this.Weapon.Range;

        this.projectileUpdate = this.update;
        this.update = function () {
            if (this.LifespanCount > this.Lifespan - this.FadeTime) this.FadeTimeCount++;
            this.projectileUpdate();
        };
        this.onHit = function () {
            // Nothing
        };
        this.hitTest = function (unit) {
            return unit.hitTestLine({X: this.X, Y: this.Y}, {X: this.EndX, Y: this.EndY});
        };

    }

    return {
        Laser: function (weapon, direction) {
            BeamProjectile.call(this, weapon, direction);

            this.draw = function (context) {
                context.save();
                context.globalAlpha = Math.max(1, this.FadeTime - this.FadeTimeCount) / this.FadeTime;
                context.strokeStyle = '#77f';
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.X, this.Y);
                context.lineTo(this.EndX, this.EndY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        },
        Bullet: function (weapon, direction, initialVelocity) {
            VelocityProjectile.call(this, weapon, direction, initialVelocity);
            this.Length = 2;

            this.draw = function (context) {
                context.save();
                context.strokeStyle = '#fff';
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.X, this.Y);
                context.lineTo(this.EndX, this.EndY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        },
        Missile: function (weapon, direction, initialVelocity, acceleration) {
            AcceleratingProjectile.call(this, weapon, direction, initialVelocity, acceleration);
            this.Length = 2;
            this.Target = null;

            this.acceleratingProjectileUpdate = this.update;
            this.update = function () {
                if (this.Target !== null) {
                    if (this.Target.IsDead) {
                        this.Target = this.Weapon.Target;
                    }
                    if (this.Target !== null) {
                        this.Direction = General.LeadingAngleRad(this.X, this.Y, initialVelocity, this.Target.X, this.Target.Y, this.Target.VelocityX, this.Target.VelocityY);
                    }
                }
                this.acceleratingProjectileUpdate();
                this.EndX = this.X + Math.cos(this.Direction) * this.Length;
                this.EndY = this.Y + Math.sin(this.Direction) * this.Length;
            };
            this.onHit = function () {
                this.die();
            };
            this.draw = function (context) {
                context.save();
                context.strokeStyle = '#f88';
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.X, this.Y);
                context.lineTo(this.EndX, this.EndY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        }
    }
});
