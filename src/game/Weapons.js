var PIXI        = require("pixi.js")
var Projectiles = require("./projectiles")
var math        = require("../util/math")
var Settings    = require("./Settings")
var Attribute   = require("./Attribute")

var pi2    = Math.PI * 2,
    degree = pi2 / 360;


module.exports = {
    Missile:         Missile,
    Gun:             Gun,
    Cannon:          Cannon,
    GrenadeLauncher: GrenadeLauncher,
    Laser:           Laser,
    Shocker:         Shocker
}

function Weapon(building) {
    this.Level          = building.Level;
    this.Building       = building;
    this.Range          = 200;
    this.Damage         = 1;
    this.FiringCone     = degree * 15;
    this.RotateSpeed    = degree * 5;
    this.getTargetAngle = function () {
        if (this.Target == null) return NaN;
        return math.angle(this.Building.x, this.Building.y, this.Target.x, this.Target.y);
    };

    // Simple Line graphic for now...
    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);
    this.graphics.lineStyle(2, 0x990000, 1);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(10, 0);

    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.Damage;
    };
    this.FireRate      = 10;
    this.FireRateCount = 10;
    this.ShotsPerShot  = 1;
    this.Accuracy      = .05;

    this.Player = this.Building.Player;

    var weapon = this;
    var me     = this;

    this.NumberOfUpgrades = 0;
    this.Attributes       = {};
    /** @returns Number */
    this.AttributeCost = function () {
        return (10 * weapon.Damage / weapon.FireRate + weapon.Range / 10)
            * (1 + 10 * weapon.Accuracy);
    };

    this.CreateAttributeForStat = function (name, upperLimit, limit, upgradeFactor, cost) {
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
                        if (typeof cost == "function") return cost();
                        return cost;
                    },
                    /** @returns Number **/
                    Metal:  function () {
                        if (typeof cost == "function") return cost();
                        return cost;
                    }
                }
            );
        }
    };
    this.CreateAttributeForStat("Range", true, 250, 1.15, this.AttributeCost);
    this.CreateAttributeForStat("FireRate", false, 1, .85, this.AttributeCost);
    this.CreateAttributeForStat("Damage", true, 30, 1.15, this.AttributeCost);
    this.CreateAttributeForStat("Accuracy", false, .01, .5, this.AttributeCost);

    this.ResetTarget = function () {
        this.Target = null;
    };
    this.ResetTarget();
    this.CreateProjectile = function () {
    };
    this.FireAtTarget     = function () {
        this.Building.Player.Resources.Ammo -= this.getAmmoConsumption();
        var shots = this.ShotsPerShot;
        while (shots--) {
            var projectile = this.CreateProjectile();
            this.Building.Level.Projectiles.push(projectile);
        }
    };
    this.FindTarget       = function () {
        var i = this.Building.Level.Units.length;
        while (i--) {
            var unit = this.Building.Level.Units[i];
            if (math.Distance(unit.x - this.Building.x, unit.y - this.Building.y) <= this.Range) {
                this.Target = unit;
            }
        }
    };

    this.TryFireAtTarget = function () {
        if (math.Distance(this.Target.x - this.Building.x, this.Target.y - this.Building.y) > this.Range) {
            this.ResetTarget();
        } else if (this.Building.Player.Resources.Ammo >= this.getAmmoConsumption()) {
            var difference = Math.abs(this.rotation - this.getTargetAngle());
            if (Math.abs(difference) < this.FiringCone / 2) {
                this.FireAtTarget();
                this.FireRateCount = 0;
            }
        }
    };
    this.update          = function () {
        if (this.Target != null && this.Target.IsDead) {
            this.ResetTarget();
        }
        if (this.Target == null) {
            this.FindTarget();
        } else {
            this.updateRotation();
        }

        if (this.FireRateCount < this.FireRate) this.FireRateCount++;
        if (this.Target != null && this.FireRateCount >= this.FireRate) {
            this.TryFireAtTarget();
        }
    };

    this.updateRotation          = function () {
        var targetAngle = this.getTargetAngle();
        var direction   = ((this.rotation - targetAngle) * 57.2957795 + 360) % 360 > 180;
        if (direction) {
            this.rotation = Math.min(targetAngle, this.rotation + this.RotateSpeed);
        } else {
            this.rotation = Math.max(targetAngle, this.rotation - this.RotateSpeed);
        }
    };
    this.getTargetAngle          = function () {
        return math.angle(this.Building.x, this.Building.y, this.Target.x, this.Target.y)
            + this.getAccuracyModification();
    };
    this.getTargetLeadingAngle   = function () {
        return math.leadingAngle(this.Building.x, this.Building.y, this.ProjectileSpeed, this.Target.x, this.Target.y, this.Target.VelocityX, this.Target.VelocityY)
            + this.getAccuracyModification();
    };
    this.getTargetLeadingVector  = function () {
        return math.leadingVector(this.Building.x, this.Building.y, this.ProjectileSpeed, this.Target.x, this.Target.y, this.Target.VelocityX, this.Target.VelocityY);
    };
    this.getAccuracyModification = function () {
        if (this.Accuracy == null) return 0;
        return Math.PI * (Math.random() * this.Accuracy - (this.Accuracy / 2));
    }
}

function Missile(range, fireRate, projectileSpeed, acceleration, damage, accuracy, explosiveSpeed, explosiveTime, explosiveInitialSize) {
    var func = function (building) {
        PIXI.Container.call(this);
        Weapon.call(this, building);
        this.ProjectileSpeed      = projectileSpeed;
        this.ExplosiveSpeed       = explosiveSpeed;
        this.ExplosiveTime        = explosiveTime;
        this.ExplosiveInitialSize = explosiveInitialSize;
        this.Range                = range;
        this.Damage               = damage;
        this.FireRate             = this.FireRateCount = fireRate;
        this.Acceleration      = acceleration;
        this.ShotSpeedVariance = accuracy;
        /** @return {number} **/
        this.getAmmoConsumption = function () {
            return this.Damage / 1.5;
        };
        this.CreateAttributeForStat("ProjectileSpeed", true, 10, 1.25, this.AttributeCost);
        this.CreateAttributeForStat("ExplosiveSpeed", true, 4, 1.1, this.AttributeCost);
        this.CreateAttributeForStat("ExplosiveTime", true, 10, 1.1, this.AttributeCost);
        this.CreateAttributeForStat("ExplosiveInitialSize", true, 30, 1.1, this.AttributeCost);
        this.CreateProjectile = function () {
            return new Projectiles.Missile(this);
        };
    };
    return setConstructor(func);
}

function Gun(range, fireRate, projectileSpeed, damage, accuracy, shotsPerShot) {
    var func = function (building) {
        PIXI.Container.call(this);
        Weapon.call(this, building);
        var me        = this;
        this.Range    = range;
        this.FireRate = this.FireRateCount = fireRate;
        this.ProjectileSpeed     = projectileSpeed;
        this.Damage              = damage;
        this.Accuracy            = 1 - accuracy;
        this.ShotsPerShot        = shotsPerShot;
        this.ProjectileClass     = Projectiles.Bullet;
        this.WeaponAttributeCost = this.AttributeCost;
        this.CreateAttributeForStat("ProjectileSpeed", true, 10, 1.25, this.AttributeCost);
        /** @return {number} **/
        this.AttributeCost = function () {
            return me.WeaponAttributeCost() * (1 + me.ProjectileSpeed / 5);
        };
        /** @return {number} **/
        this.getAmmoConsumption = function () {
            return this.Damage / 2 * this.ProjectileSpeed / 3;
        };
        this.CreateProjectile = function () {
            return new this.ProjectileClass(this);
        };
    };
    return setConstructor(func);
}

function Cannon(range, fireRate, projectileSpeed, damage, accuracy, shotsPerShot, explosiveSpeed, explosiveTime, explosiveInitialSize) {
    var constructor = Gun(range, fireRate, projectileSpeed, damage, accuracy, shotsPerShot);
    var func        = function (building) {
        var me = this;
        constructor.call(me, building);
        this.ProjectileClass      = Projectiles.Cannon;
        this.ExplosiveSpeed       = explosiveSpeed;
        this.ExplosiveTime        = explosiveTime;
        this.ExplosiveInitialSize = explosiveInitialSize;
        this.GunAttributeCost     = this.AttributeCost;
        /** @return {number} **/
        this.getAmmoConsumption = function () {
            return this.Damage * 2 * (this.ExplosiveSpeed + this.ExplosiveTime + this.ExplosiveInitialSize / 20);
        };
        /** @return {number} **/
        this.AttributeCost = function () {
            return me.GunAttributeCost() * (1 + (me.ExplosiveTime + me.ExplosiveSpeed + me.ExplosiveInitialSize / 20) / 5);
        };
        this.CreateAttributeForStat("ExplosiveSpeed", true, 4, 1.1, this.AttributeCost);
        this.CreateAttributeForStat("ExplosiveTime", true, 10, 1.1, this.AttributeCost);
        this.CreateAttributeForStat("ExplosiveInitialSize", true, 30, 1.1, this.AttributeCost);
    };
    return setConstructor(func);
}

function GrenadeLauncher(range, fireRate, projectileSpeed, projectileSlowFactor, damage, accuracy, shotsPerShot, explosiveSpeed, explosiveTime, explosiveInitialSize) {
    var constructor = Gun(range, fireRate, projectileSpeed, damage, accuracy, shotsPerShot);
    var func        = function (building) {
        var me = this;
        constructor.call(this, building);
        this.ProjectileClass      = Projectiles.Grenade;
        this.ProjectileSlowFactor = projectileSlowFactor;
        this.ExplosiveSpeed       = explosiveSpeed;
        this.ExplosiveTime        = explosiveTime;
        this.ExplosiveInitialSize = explosiveInitialSize;
        this.GunAttributeCost     = this.AttributeCost;
        /** @return {number} **/
        this.getAmmoConsumption = function () {
            return this.Damage * 2 * (this.ExplosiveSpeed + this.ExplosiveTime + this.ExplosiveInitialSize / 20);
        };
        /** @return {number} **/
        this.AttributeCost = function () {
            return me.GunAttributeCost() * (1 + (me.ExplosiveTime + me.ExplosiveSpeed + me.ExplosiveInitialSize / 20) / 5);
        };
        this.CreateAttributeForStat("ExplosiveSpeed", true, 4, 1.1, this.AttributeCost);
        this.CreateAttributeForStat("ExplosiveTime", true, 10, 1.1, this.AttributeCost);
        this.CreateAttributeForStat("ExplosiveInitialSize", true, 30, 1.1, this.AttributeCost);
    };
    return setConstructor(func);
}

function Laser(range, fireRate, lifeSpan, damage, accuracy) {
    var func = function (building) {
        PIXI.Container.call(this);
        Weapon.call(this, building);
        this.Lifespan = lifeSpan;
        this.Range    = range;
        /** @return {number} **/
        this.Damage = damage;
        this.FireRate = this.FireRateCount = fireRate;
        this.Accuracy = 1 - accuracy;
        /** @return {number} **/
        this.getAmmoConsumption = function () {
            return this.Damage * 3 / this.Lifespan;
        };
        this.CreateProjectile = function () {
            return new Projectiles.Laser(this);
        };
    };
    return setConstructor(func);
}

function Shocker(range, fireRate, lifeSpan, damage) {
    var func = function (building) {
        PIXI.Container.call(this);
        Weapon.call(this, building);
        this.Lifespan = lifeSpan;
        this.Range    = range;
        /** @return {number} **/
        this.Damage = damage;
        this.FireRate = this.FireRateCount = fireRate;
        /** @return {number} **/
        this.getAmmoConsumption = function () {
            return this.Damage * 3 / this.Lifespan;
        };
        this.CreateProjectile = function () {
            return new Projectiles.Shock(this);
        };
    };
    return setConstructor(func);
}

function setConstructor(Func) {
    Func.prototype             = Object.create(PIXI.Container.prototype);
    Func.prototype.constructor = Func;
    return Func;
}

