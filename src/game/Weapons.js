define("game/Weapons", ["game/Projectiles", "util/General", "game/Settings"], function (Projectiles, General, Settings) {

    function Weapon(building) {
        this.Building = building;
        this.Range = 200;
        this.Damage = 1;

        /** @return {number} **/
        this.AmmoConsumption = function () {
            return this.Damage / 2;
        };
        this.FireRate = 10;
        this.FireRateCount = 10;
        this.ShotsPerShot = 1;
        this.ShotSpread = .05;

        var player = this.Building.Player;

        var weapon = this;

        this.Attributes = {
            Range: (function () {
                var attribute = function () {
                    return weapon.Range;
                };
                attribute.Upgrade = function () {
                    if (!weapon.Attributes.Range.IsEnabled()) return;
                    player.TryApplyCost(weapon.Attributes.Range.Cost);
                    weapon.Range += 5;
                };
                /** @return {boolean} **/
                attribute.IsEnabled = function () {
                    return weapon.Range <= 250
                        && player.TestApplyCost(weapon.Attributes.Range.Cost);
                };
                attribute.Cost = {
                    /** @returns Number **/
                    Energy: function () {
                        return weapon.Range / 25;
                    },
                    /** @returns Number **/
                    Metal: function () {
                        return weapon.Range / 50;
                    }
                };
                return attribute;
            })(),
            FireRate: (function () {
                var attribute = function () {
                    return weapon.FireRate;
                };
                attribute.Upgrade = function () {
                    if (!weapon.Attributes.FireRate.IsEnabled()) return;
                    player.TryApplyCost(weapon.Attributes.FireRate.Cost);
                    weapon.FireRate -= 1;
                };
                /** @return {boolean} **/
                attribute.IsEnabled = function () {
                    return weapon.FireRate > 1
                        && player.TestApplyCost(weapon.Attributes.FireRate.Cost);
                };
                attribute.Cost = {
                    /** @returns Number **/
                    Energy: function () {
                        return (60 / weapon.FireRate) * 5;
                    },
                    /** @returns Number **/
                    Metal: function () {
                        return (60 / weapon.FireRate) * 2.5;
                    }
                };
                return attribute;
            })(),
            ProjectileSpeed: (function () {
                var attribute = function () {
                    return weapon.ProjectileSpeed;
                };
                attribute.Upgrade = function () {
                    if (!weapon.Attributes.ProjectileSpeed.IsEnabled()) return;
                    player.TryApplyCost(weapon.Attributes.ProjectileSpeed.Cost);
                    weapon.ProjectileSpeed += .1;
                };
                /** @return {boolean} **/
                attribute.IsEnabled = function () {
                    return weapon.ProjectileSpeed < 10
                        && player.TestApplyCost(weapon.Attributes.ProjectileSpeed.Cost);
                };
                attribute.Cost = {
                    /** @returns Number **/
                    Energy: function () {
                        return (weapon.ProjectileSpeed * 2);
                    },
                    /** @returns Number **/
                    Metal: function () {
                        return (weapon.ProjectileSpeed);
                    }
                };
                return attribute;
            })(),
            Damage: (function () {
                var attribute = function () {
                    return weapon.Damage;
                };
                attribute.Upgrade = function () {
                    if (!weapon.Attributes.Damage.IsEnabled()) return;
                    player.TryApplyCost(weapon.Attributes.Damage.Cost);
                    weapon.Damage += .25;
                };
                /** @returns bool **/
                attribute.IsEnabled = function () {
                    return weapon.Damage < 30
                        && player.TestApplyCost(weapon.Attributes.Damage.Cost);
                };
                attribute.Cost = {
                    /** @returns Number **/
                    Energy: function () {
                        return (weapon.Damage * 4);
                    },
                    /** @returns Number **/
                    Metal: function () {
                        return (weapon.Damage * 2);
                    }
                };
                return attribute;
            })(),
            Accuracy: (function () {
                var attribute = function () {
                    return weapon.ShotSpread;
                };
                attribute.Upgrade = function () {
                    if (!weapon.Attributes.Accuracy.IsEnabled()) return;
                    player.TryApplyCost(weapon.Attributes.Accuracy.Cost);
                    weapon.ShotSpread = Math.min(1, weapon.ShotSpread * 1.005);
                };
                /** @returns bool **/
                attribute.IsEnabled = function () {
                    return weapon.ShotSpread < 1
                        && player.TestApplyCost(weapon.Attributes.Accuracy.Cost);
                };
                attribute.Cost = {
                    /** @returns Number **/
                    Energy: function () {
                        return 6;
                    },
                    /** @returns Number **/
                    Metal: function () {
                        return 3;
                    }
                };
                return attribute;
            })()
        };

        this.ResetTarget = function () {
            this.Target = null;
        };
        this.ResetTarget();
        this.CreateProjectile = function () {
        };
        this.FireAtTarget = function () {
            this.Building.Player.Resources.Ammo -= this.AmmoConsumption();
            var shots = this.ShotsPerShot;
            while (shots--) {
                var projectile = this.CreateProjectile();
                this.Building.Level.Projectiles.push(projectile);
            }
        };
        this.FindTarget = function () {
            var i = this.Building.Level.Units.length;
            while (i--) {
                var unit = this.Building.Level.Units[i];
                if (General.Distance(unit.X - this.Building.X, unit.Y - this.Building.Y) <= this.Range) {
                    this.Target = unit;
                }
            }
        };

        this.TryFireAtTarget = function () {
            if (General.Distance(this.Target.X - this.Building.X, this.Target.Y - this.Building.Y) > this.Range) {
                this.ResetTarget();
            } else if (this.Building.Player.Resources.Ammo >= this.AmmoConsumption()) {
                this.FireAtTarget();
                this.FireRateCount = 0;
            }
        };
        this.update = function () {
            if (this.Target != null && this.Target.IsDead) {
                this.ResetTarget();
            }
            if (this.Target == null) {
                this.FindTarget();
            }

            if (this.FireRateCount < this.FireRate) this.FireRateCount++;
            if (this.Target != null && this.FireRateCount >= this.FireRate) {
                this.TryFireAtTarget();
            }
        };
        this.getTargetLeadingAngle = function () {
            return General.LeadingAngleRad(this.Building.X, this.Building.Y, this.ProjectileSpeed, this.Target.X, this.Target.Y, this.Target.VelocityX, this.Target.VelocityY);
        }
    }

    return {
        Missile: function (range, fireRate, projectileSpeed, acceleration, damage, accuracy) {
            return function (building) {
                Weapon.call(this, building);
                this.Range = range;
                /** @return {number} **/
                this.AmmoConsumption = function () {
                    return this.Damage / 1.5;
                };
                this.FireRate = this.FireRateCount = fireRate;
                this.ProjectileSpeed = projectileSpeed;
                this.Damage = damage;
                this.ShotSpeedVariance = accuracy; //General.AngleRad(this.Building.X, this.Building.Y, this.Target.X, this.Target.Y)
                this.Acceleration = acceleration;
                this.CreateProjectile = function () {
                    var angle = this.getTargetLeadingAngle();
                    var projectile = new Projectiles.Missile(
                        this,
                            angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2)),
                            this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2)),
                        this.Acceleration
                    );
                    projectile.Target = this.Target;
                    projectile.Damage = this.Damage;
                    projectile.Width = Math.sqrt(this.Damage);
                    return projectile;
                };
            }
        },
        Gun: function (range, fireRate, projectileSpeed, damage, accuracy) {
            return function (building) {
                Weapon.call(this, building);
                this.Range = range;
                this.FireRate = this.FireRateCount = fireRate;
                this.ProjectileSpeed = 3;
                this.Damage = damage;
                this.ShotSpeedVariance = 1 - accuracy;
                this.CreateProjectile = function () {
                    var angle = this.getTargetLeadingAngle();
                    var projectile = new Projectiles.Bullet(
                        this,
                            angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2)),
                            this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2))
                    );
                    projectile.Damage = this.Damage;
                    projectile.Width = Math.sqrt(this.Damage);
                    return projectile;
                };
            };
        },
        Shotgun: function (building) {
            Weapon.call(this, building);
            this.Range = 120;
            this.ShotsPerShot = 5;
            this.ShotSpeedVariance = .05;
            /** @return {number} **/
            this.AmmoConsumption = function () {
                return this.ShotsPerShot * this.Damage;
            };
            this.FireRate = this.FireRateCount = 60;
            this.ProjectileSpeed = 2.3;
            this.Damage = 5;
            this.ShotSpeedVariance = .2;
            this.CreateProjectile = function () {
                var angle = this.getTargetLeadingAngle();
                var projectile = new Projectiles.Bullet(
                    this,
                        angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2)),
                        this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2))
                );
                projectile.Damage = this.Damage;
                projectile.Width = Math.sqrt(this.Damage);
                return projectile;
            };
        },
        Laser: function (building) {
            Weapon.call(this, building);
            this.Lifespan = Settings.Second;
            this.Range = 185;
            this.ShotsPerShot = 1;
            /** @return {number} **/
            this.Damage = 4;
            this.FireRate = this.FireRateCount = 60;
            this.CreateProjectile = function () {
                var angle = this.getTargetLeadingAngle();
                var projectile = new Projectiles.Laser(
                    this,
                        angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2))
                );
                projectile.Damage = this.Damage / this.Lifespan;
                projectile.Width = this.Damage / 4;
                return projectile;
            };
        }
    };
})
;