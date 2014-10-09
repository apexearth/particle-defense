define("game/Projectiles", ["game/Settings", "util/General"], function (Settings, General) {
    var arcCircle = 2 * Math.PI;

    function Projectile(weapon) {
        this.Level = weapon.Building.Level;
        this.Building = weapon.Building;
        this.Weapon = weapon;
        this.X = this.Building.X;
        this.Y = this.Building.Y;
        this.Damage = 1;
        /** @returns Number **/
        this.EffectiveDamage = function (unit) {
            return this.Damage;
        };
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
                    unit.damage(this.EffectiveDamage(unit));
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
        };
        this.hitTest = function (unit) {
            return unit.hitTestLine({X: this.X, Y: this.Y}, {X: this.LastX, Y: this.LastY}, this.Width);
        };
    }

    function ExplosiveProjectile(weapon, direction, initialVelocity) {
        VelocityProjectile.call(this, weapon, direction, initialVelocity);

        this.ExplosiveSpeed = weapon.ExplosiveSpeed;
        this.ExplosiveTime = weapon.ExplosiveTime;

        this.inheritedOnHit = this.onHit;
        this.onHit = function () {
            this.inheritedOnHit();
            var explosion = new Explosion.Basic(this);
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
        /** @returns Number */
        this.EffectiveDamage = function (unit) {
            return this.Damage * General.Distance(this.X - unit.X, this.Y - unit.Y) / this.Weapon.Range;
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
            return unit.hitTestLine({X: this.X, Y: this.Y}, {X: this.EndX, Y: this.EndY});
        };

    }

    var Explosion = {
        Basic: function (particle) {
            particle.Level.Objects.push(this);
            this.Level = particle.Level;
            this.X = particle.X;
            this.Y = particle.Y;
            this.ExplosiveSpeed = particle.ExplosiveSpeed;
            this.ExplosiveTime = particle.ExplosiveTime * Settings.Second;
            this.ExplosiveTimeCount = 0;
            this.Damage = particle.Damage / Settings.Second;
            this.Radius = this.Damage * 2;

            this.update = function () {
                this.ExplosiveTimeCount++;
                this.Radius += this.ExplosiveSpeed;
                var i = this.Level.Units.length;
                while (i--) {
                    var unit = this.Level.Units[i];
                    if (unit.hitTest(this)) {
                        unit.damage(this.Damage);
                    }
                }
                if (this.ExplosiveTimeCount >= this.ExplosiveTime) {
                    particle.Level.Objects.splice(particle.Level.Objects.indexOf(this), 1);
                }
            };

            this.draw = function (context) {
                var alpha = ((this.ExplosiveTime - this.ExplosiveTimeCount) / this.ExplosiveTime / 1.2);
                context.fillStyle = 'rgba(255,50,50,' + alpha + ')';
                context.beginPath();
                context.arc(this.X, this.Y, this.Radius, 0, arcCircle, false);
                context.fill();
                context.closePath();
            };
        }
    };

    return {
        Laser: function (weapon, direction) {
            BeamProjectile.call(this, weapon, direction);

            this.draw = function (context) {
                context.save();
                context.globalAlpha = Math.max(1, this.FadeTime - this.FadeTimeCount) / this.FadeTime;
                var grad = context.createLinearGradient(this.X, this.Y, this.EndX, this.EndY);
                grad.addColorStop(0, '#77f');
                grad.addColorStop(1, '#227');
                context.strokeStyle = grad;
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

            this.draw = function (context) {
                context.save();
                context.strokeStyle = '#fff';
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.X, this.Y);
                context.lineTo(this.LastX, this.LastY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        },
        ExplosiveBullet: function (weapon, direction, initialVelocity) {
            ExplosiveProjectile.call(this, weapon, direction, initialVelocity);

            this.draw = function (context) {
                context.save();
                context.strokeStyle = '#fff';
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.X, this.Y);
                context.lineTo(this.LastX, this.LastY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        },
        Missile: function (weapon, direction, initialVelocity, acceleration) {
            AcceleratingProjectile.call(this, weapon, direction, initialVelocity, acceleration);
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
                context.lineTo(this.LastX, this.LastY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        }
    }
})
;
