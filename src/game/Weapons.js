define("game/Weapons", ["game/Projectiles", "util/General", "game/Settings", "game/Attribute"], function (Projectiles, General, Settings, Attribute) {

    function Weapon(building) {
        this.Building = building;
        this.Range = 200;
        this.Damage = 1;

        /** @return {number} **/
        this.AmmoConsumption = function () {
            return this.Damage;
        };
        this.FireRate = 10;
        this.FireRateCount = 10;
        this.ShotsPerShot = 1;
        this.Accuracy = .05;

        this.Player = this.Building.Player;

        var weapon = this;
        var me = this;

        this.NumberOfUpgrades = 0;
        this.Attributes = {  };


        this.CreateAttributeForStat = function (name, upperLimit, limit, upgradeFactor, energyCost, metalCost) {
            if (weapon[name] != null) {
                me.Attributes[name] = new Attribute(me,
                    function () {
                        return weapon[name];
                    },
                    function () {
                        weapon[name] *= upgradeFactor;
                    },
                    function () {
                        if (upperLimit) return weapon[name] <= limit;
                        return weapon[name] >= limit;
                    },
                    {
                        /** @returns Number **/
                        Energy: function () {
                            if (typeof energyCost == "function") return energyCost();
                            return energyCost;
                        },
                        /** @returns Number **/
                        Metal: function () {
                            if (typeof metalCost == "function") return metalCost();
                            return metalCost;
                        }
                    }
                );
            }
        };
        this.CreateAttributeForStat("Range", true, 250, 1.1, function () {return weapon.Range / 25}, function () {return weapon.Range / 50});
        this.CreateAttributeForStat("FireRate", false, 1, .95, function () {return 300 * weapon.Damage / 5 / weapon.FireRate}, function () {return 6000 * weapon.Damage / (25 * weapon.FireRate)});
        this.CreateAttributeForStat("Damage", true, 30, 1.1, function () {return 300 * weapon.Damage / 5 / weapon.FireRate}, function () {return 6000 * weapon.Damage / (25 * weapon.FireRate)});
        this.CreateAttributeForStat("Accuracy", true, 30, .95, function () {return 6}, function () {return 3});

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
                this.CreateAttributeForStat("ProjectileSpeed", true, 10, 1.1, function () {return this.ProjectileSpeed * 4}, function () {return this.ProjectileSpeed * 2});
                this.Damage = damage;
                this.ShotSpeedVariance = accuracy; //General.AngleRad(this.Building.X, this.Building.Y, this.Target.X, this.Target.Y)
                this.Acceleration = acceleration;
                this.CreateProjectile = function () {
                    var angle = this.getTargetLeadingAngle();
                    var projectile = new Projectiles.Missile(
                        this,
                            angle * (Math.random() * this.Accuracy + (1 - this.Accuracy / 2)),
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
        Gun: function (range, fireRate, projectileSpeed, damage, accuracy, shotsPerShot) {
            return function (building) {
                Weapon.call(this, building);
                this.Range = range;
                this.FireRate = this.FireRateCount = fireRate;
                this.ProjectileSpeed = projectileSpeed;
                this.CreateAttributeForStat("ProjectileSpeed", true, 10, 1.1, function () {return this.ProjectileSpeed * 4}, function () {return this.ProjectileSpeed * 2});
                this.Damage = damage;
                this.Accuracy = 1 - accuracy;
                this.ShotsPerShot = shotsPerShot;
                this.ProjectileClass = Projectiles.Bullet;
                /** @return {number} **/
                this.AmmoConsumption = function () {
                    return this.Damage / 2 * this.ProjectileSpeed / 3;
                };
                this.CreateProjectile = function () {
                    var angle = this.getTargetLeadingAngle();
                    var projectile = new this.ProjectileClass(
                        this,
                        angle + Math.PI * (Math.random() * this.Accuracy - (this.Accuracy / 2)),
                        this.ProjectileSpeed
                    );
                    projectile.Damage = this.Damage / this.ShotsPerShot;
                    projectile.Width = Math.sqrt(this.Damage) * 2 / this.ProjectileSpeed * 3;
                    return projectile;
                };
            };
        },
        Cannon: function (range, fireRate, projectileSpeed, damage, accuracy, shotsPerShot) {
            var constructor = this.Gun(range, fireRate, projectileSpeed, damage, accuracy, shotsPerShot);
            return function(building) {
                constructor.call(this, building);
                this.ProjectileClass = Projectiles.ExplosiveBullet;
            }
        },
        Laser: function (range, fireRate, lifeSpan, damage, accuracy) {
            return function (building) {
                Weapon.call(this, building);
                this.Lifespan = lifeSpan;
                this.Range = range;
                /** @return {number} **/
                this.Damage = damage;
                this.FireRate = this.FireRateCount = fireRate;
                this.Accuracy = 1 - accuracy;
                /** @return {number} **/
                this.AmmoConsumption = function () {
                    return this.Damage * 10 / this.Lifespan;
                };
                this.CreateProjectile = function () {
                    var angle = this.getTargetLeadingAngle();
                    var projectile = new Projectiles.Laser(
                        this,
                            angle * (Math.random() * this.Accuracy + (1 - this.Accuracy / 2))
                    );
                    projectile.Lifespan = this.Lifespan;
                    projectile.Damage = this.Damage / this.Lifespan;
                    projectile.Width = this.Damage * 10 / this.Lifespan;
                    return projectile;
                };
            };
        }
    };
})
;