define("game/Weapons", ["game/Projectiles", "util/General", "game/Settings"], function (Projectiles, General, Settings) {

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

        var player = this.Building.Player;

        var weapon = this;
        var me = this;

        this.NumberOfUpgrades = 0;
        this.Attributes = {  };
        var createAttribute = function (valueF, actionF, upgradeF, cost) {
            var attribute = valueF;
            attribute.Upgrade = function () {
                if (!attribute.CanUpgrade()) return;
                player.TryApplyCost(attribute.Cost);
                actionF();
                me.NumberOfUpgrades++;
            };
            /** @return {boolean} **/
            attribute.CanUpgrade = function () {
                if (upgradeF !== null && !upgradeF()) return false;
                return player.TestApplyCost(attribute.Cost);
            };
            attribute.Cost = {};
            for (var c in cost) {
                if (cost.hasOwnProperty(c)) {
                    attribute.Cost[c] = function () {
                        return Math.pow(cost[c](), 1 + me.NumberOfUpgrades / 100);
                    }
                }
            }
            return attribute;
        };
        var createAttributeForStat = function (name, upperLimit, limit, upgradeFactor, energyCost, metalCost) {
            if (weapon[name] != null) {
                me.Attributes[name] = createAttribute(
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
                            return energyCost();
                        },
                        /** @returns Number **/
                        Metal: function () {
                            return metalCost();
                        }
                    }
                );
            }
        };

        createAttributeForStat("Range", true, 250, 1.1, function () {return weapon.Range / 25}, function () {return weapon.Range / 50});
        createAttributeForStat("FireRate", false, 1, .95, function () {return 300 * weapon.Damage / 5 / weapon.FireRate}, function () {return 600 * weapon.Damage / 5 / weapon.FireRate});
        createAttributeForStat("ProjectileSpeed", true, 10, 1.1, function () {return weapon.ProjectileSpeed * 4}, function () {return weapon.ProjectileSpeed * 2});
        createAttributeForStat("Damage", true, 30, 1.1, function () {return 300 * weapon.Damage / 5 / weapon.FireRate}, function () {return 600 * weapon.Damage / 5 / weapon.FireRate});
        createAttributeForStat("Accuracy", true, 30, .95, function () {return 6}, function () {return 3});

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
                this.Damage = damage;
                this.Accuracy = 1 - accuracy;
                this.ShotsPerShot = shotsPerShot;
                /** @return {number} **/
                this.AmmoConsumption = function () {
                    return this.Damage / 2 * this.ProjectileSpeed / 3;
                };
                this.CreateProjectile = function () {
                    var angle = this.getTargetLeadingAngle();
                    var projectile = new Projectiles.Bullet(
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