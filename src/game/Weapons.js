define("game/Weapons", ["game/Projectiles", "util/General", "game/Settings"], function (Projectiles, General, Settings) {
    function Weapon(building) {
        this.Building = building;
        this.Range = 200;
        this.AmmoConsumption = 1;
        this.FireRate = 10;
        this.FireRateCount = 10;
        this.ShotsPerShot = 1;
        this.ShotSpread = .05;

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
        }

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
        Missile: function (building) {
            Weapon.call(this, building);
            this.Range = 250;
            this.AmmoConsumption = 7;
            this.FireRate = this.FireRateCount = 45;
            this.ProjectileSpeed = 2;
            this.ShotSpeedVariance = .1; //General.AngleRad(this.Building.X, this.Building.Y, this.Target.X, this.Target.Y)
            this.Acceleration = .25;
            this.CreateProjectile = function () {
                var angle = this.getTargetLeadingAngle();
                var projectile = new Projectiles.Missile(
                    this,
                        angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2)),
                        this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2)),
                    this.Acceleration
                );
                projectile.Target = this.Target;
                projectile.Damage = 10;
                projectile.Width = 2.5;
                return projectile;
            };
        },
        Gun: function (range, fireRate, projectileSpeed, damage, accuracy) {
            return function (building) {
                Weapon.call(this, building);
                this.Range = range;
                this.AmmoConsumption = damage / 2;
                this.FireRate = this.FireRateCount = fireRate;
                this.ProjectileSpeed = 3;
                this.ShotSpeedVariance = 1 - accuracy;
                this.CreateProjectile = function () {
                    var angle = this.getTargetLeadingAngle();
                    var projectile = new Projectiles.Bullet(
                        this,
                            angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2)),
                            this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2))
                    );
                    projectile.Damage = damage;
                    projectile.Width = Math.max(1, damage / 2);
                    return projectile;
                };
            };
        },
        Autogun: function (building) {
            Weapon.call(this, building);
            this.Range = 100;
            this.AmmoConsumption = 1.5;
            this.FireRate = this.FireRateCount = 5;
            this.ProjectileSpeed = 4;
            this.ShotSpeedVariance = .2;
            this.CreateProjectile = function () {
                var angle = this.getTargetLeadingAngle();
                var projectile = new Projectiles.Bullet(
                    this,
                        angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2)),
                        this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2))
                );
                projectile.Damage = 3;
                projectile.Width = 1.5;
                return projectile;
            };
        },
        Cannon: function (building) {
            Weapon.call(this, building);
            this.Range = 140;
            this.AmmoConsumption = 2;
            this.FireRate = this.FireRateCount = 30;
            this.ProjectileSpeed = 2.3;
            this.ShotSpeedVariance = .2;
            this.CreateProjectile = function () {
                var angle = this.getTargetLeadingAngle();
                var projectile = new Projectiles.Bullet(
                    this,
                        angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2)),
                        this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2))
                );
                projectile.Damage = 10;
                projectile.Width = 5;
                return projectile;
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
            this.ShotSpeedVariance = .2;
            this.CreateProjectile = function () {
                var angle = this.getTargetLeadingAngle();
                var projectile = new Projectiles.Bullet(
                    this,
                        angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2)),
                        this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2))
                );
                projectile.Damage = 5;
                projectile.Width = 2.5;
                return projectile;
            };
        },
        Laser: function (building) {
            Weapon.call(this, building);
            this.Lifespan = Settings.Second;
            this.Range = 185;
            this.ShotsPerShot = 1;
            this.AmmoConsumption = 5;
            this.FireRate = this.FireRateCount = Settings.Second * 2;
            this.CreateProjectile = function () {
                var angle = this.getTargetLeadingAngle();
                var projectile = new Projectiles.Laser(
                    this,
                        angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2))
                );
                projectile.Damage = .4;
                projectile.Width = 2;
                return projectile;
            };
        }
    };
});