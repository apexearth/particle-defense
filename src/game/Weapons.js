define("game/Weapons", ["game/Projectiles", "util/General", "game/Settings"], function (Projectiles, General, Settings) {
    function Weapon(building) {
        this.Building = building;
        this.Range = 200;
        this.AmmoConsumption = 1;
        this.FireRate = 10;
        this.FireRateCount = 10;
        this.ShotsPerShot = 1;
        this.ShotSpread = .05;

        var weapon = this;
        var player = this.Building.Player;

        this.Upgrades = {};
        this.Upgrades.Range = function () {
            if (!weapon.Upgrades.Range.IsEnabled()) return;
            weapon.Building.Player.TryApplyCost(this.Cost);
            weapon.Range += 1;
        };
        /** @returns bool **/
        this.Upgrades.Range.IsEnabled = function () {
            return weapon.Range <= 250
                && player.TestApplyCost(weapon.Upgrades.Range.Cost);
        };
        this.Upgrades.Range.Cost = {
            /** @returns Number **/
            Energy: function () {
                return weapon.Range / 25;
            },
            /** @returns Number **/
            Metal: function () {
                return weapon.Range / 50;
            }
        };
        this.Upgrades.FireRate = function () {
            if (!weapon.Upgrades.FireRate.IsEnabled()) return;
            weapon.Building.Player.TryApplyCost(this.Cost);
            weapon.FireRate -= 1;
        };
        /** @returns bool **/
        this.Upgrades.FireRate.IsEnabled = function () {
            return weapon.FireRate > 1
                && player.TestApplyCost(weapon.Upgrades.FireRate.Cost);
        };
        this.Upgrades.FireRate.Cost = {
            /** @returns Number **/
            Energy: function () {
                return (70 - weapon.FireRate) / 10;
            },
            /** @returns Number **/
            Metal: function () {
                return (65 - weapon.FireRate) / 5;
            }
        };
        this.Upgrades.ProjectileSpeed = function () {
            if (!weapon.Upgrades.ProjectileSpeed.IsEnabled()) return;
            weapon.Building.Player.TryApplyCost(this.Cost);
            weapon.ProjectileSpeed += .1;
        };
        /** @returns bool **/
        this.Upgrades.ProjectileSpeed.IsEnabled = function () {
            return weapon.ProjectileSpeed < 10
                && player.TestApplyCost(weapon.Upgrades.ProjectileSpeed.Cost);
        };
        this.Upgrades.ProjectileSpeed.Cost = {
            /** @returns Number **/
            Energy: function () {
                return (weapon.ProjectileSpeed * 5);
            },
            /** @returns Number **/
            Metal: function () {
                return (weapon.ProjectileSpeed * 3);
            }
        };
        this.Upgrades.Damage = function () {
            if (!weapon.Upgrades.Damage.IsEnabled()) return;
            weapon.Building.Player.TryApplyCost(this.Cost);
            weapon.Damage += 1;
        };
        /** @returns bool **/
        this.Upgrades.Damage.IsEnabled = function () {
            return weapon.Damage < 30
                && player.TestApplyCost(weapon.Upgrades.Damage.Cost);
        };
        this.Upgrades.Damage.Cost = {
            /** @returns Number **/
            Energy: function () {
                return (weapon.Damage * 5);
            },
            /** @returns Number **/
            Metal: function () {
                return (weapon.Damage * 3);
            }
        };
        this.Upgrades.ShotSpread = function () {
            if (!weapon.Upgrades.ShotSpread.IsEnabled()) return;
            weapon.Building.Player.TryApplyCost(this.Cost);
            weapon.ShotSpread = Math.min(1, weapon.ShotSpread * 1.005);
        };
        /** @returns bool **/
        this.Upgrades.ShotSpread.IsEnabled = function () {
            return weapon.ShotSpread < 1
                && player.TestApplyCost(weapon.Upgrades.ShotSpread.Cost);
        };
        this.Upgrades.ShotSpread.Cost = {
            /** @returns Number **/
            Energy: function () {
                return 6;
            },
            /** @returns Number **/
            Metal: function () {
                return 3;
            }
        };

        this.ResetTarget = function () {
            this.Target = null;
        };
        this.ResetTarget();
        this.CreateProjectile = function () {
        };
        this.FireAtTarget = function () {
            this.Building.Player.Resources.Ammo -= this.AmmoConsumption;
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
            } else if (this.Building.Player.Resources.Ammo >= this.AmmoConsumption) {
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
                this.AmmoConsumption = damage / 1.5;
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
                this.AmmoConsumption = damage / 2;
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
            this.AmmoConsumption = 12.5;
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
            this.AmmoConsumption = 5;
            this.Damage = .4;
            this.FireRate = this.FireRateCount = Settings.Second * 2;
            this.CreateProjectile = function () {
                var angle = this.getTargetLeadingAngle();
                var projectile = new Projectiles.Laser(
                    this,
                        angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2))
                );
                projectile.Damage = this.Damage;
                projectile.Width = this.Damage * 4;
                return projectile;
            };
        }
    };
});