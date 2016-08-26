var PIXI = require('pixi.js');
var Projectiles = require('./projectiles');
var math = require('../util/math');
var Attribute = require('./Attribute');

var pi2 = Math.PI * 2,
    degree = pi2 / 360;

module.exports = {
    Missile: Missile,
    Gun: Gun,
    Cannon: Cannon,
    GrenadeLauncher: GrenadeLauncher,
    Laser: Laser,
    Shocker: Shocker
};

function Weapon(options) {
    PIXI.Container.call(this);

    options = options || {};
    this.building = options.building;
    this.player = this.building.player;

    this.range = 200;
    this.damage = 1;
    this.firingCode = degree * 15;
    this.rotateSpeed = degree * 5;
    this.getTargetAngle = function () {
        if (this.target == null) return NaN;
        return math.angle(this.building.x, this.building.y, this.target.x, this.target.y);
    };

    // Simple Line graphic for now...
    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);
    this.graphics.lineStyle(2, 0x990000, 1);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(10, 0);

    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage;
    };
    this.fireRate = 10;
    this.fireRateCount = 10;
    this.shotsPerShot = 1;
    this.accuracy = .05;

    var weapon = this;
    var me = this;

    this.upgradeCount = 0;
    this.attributes = {};
    /** @returns Number */
    this.attributeCost = function () {
        return (10 * weapon.damage / weapon.fireRate + weapon.range / 10)
            * (1 + 10 * weapon.accuracy);
    };

    this.createAttributeForStat = function (name, upperLimit, limit, upgradeFactor, cost) {
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
                    energy: function () {
                        if (typeof cost == 'function') return cost();
                        return cost;
                    },
                    /** @returns Number **/
                    metal: function () {
                        if (typeof cost == 'function') return cost();
                        return cost;
                    }
                }
            );
        }
    };
    this.createAttributeForStat('Range', true, 250, 1.15, this.attributeCost);
    this.createAttributeForStat('FireRate', false, 1, .85, this.attributeCost);
    this.createAttributeForStat('Damage', true, 30, 1.15, this.attributeCost);
    this.createAttributeForStat('Accuracy', false, .01, .5, this.attributeCost);

    this.resetTarget = function () {
        this.target = null;
    };
    this.resetTarget();
    this.createProjectile = function () {
    };
    this.fireAtTarget = function () {
        this.building.player.resources.ammo -= this.getAmmoConsumption();
        var shots = this.shotsPerShot;
        while (shots--) {
            var projectile = this.createProjectile();
            this.building.level.projectiles.push(projectile);
        }
    };
    this.findTarget = function () {
        var i = this.building.level.units.length;
        while (i--) {
            var unit = this.building.level.units[i];
            if (math.distance(unit.x - this.building.x, unit.y - this.building.y) <= this.range) {
                this.target = unit;
            }
        }
    };

    this.tryFireAtTarget = function () {
        if (math.distance(this.target.x - this.building.x, this.target.y - this.building.y) > this.range) {
            this.resetTarget();
        } else if (this.building.player.resources.ammo >= this.getAmmoConsumption()) {
            var difference = Math.abs(this.rotation - this.getTargetAngle());
            if (Math.abs(difference) < this.firingCode / 2) {
                this.fireAtTarget();
                this.fireRateCount = 0;
            }
        }
    };
    this.update = function () {
        if (this.target != null && this.target.dead) {
            this.resetTarget();
        }
        if (this.target == null) {
            this.findTarget();
        } else {
            this.updateRotation();
        }

        if (this.fireRateCount < this.fireRate) this.fireRateCount++;
        if (this.target != null && this.fireRateCount >= this.fireRate) {
            this.tryFireAtTarget();
        }
    };

    this.updateRotation = function () {
        var targetAngle = this.getTargetAngle();
        var direction = ((this.rotation - targetAngle) * 57.2957795 + 360) % 360 > 180;
        if (direction) {
            this.rotation = Math.min(targetAngle, this.rotation + this.rotateSpeed);
        } else {
            this.rotation = Math.max(targetAngle, this.rotation - this.rotateSpeed);
        }
    };
    this.getTargetAngle = function () {
        return math.angle(this.building.x, this.building.y, this.target.x, this.target.y)
            + this.getAccuracyModification();
    };
    this.getTargetLeadingAngle = function () {
        return math.leadingAngle(this.building.x, this.building.y, this.projectileSpeed, this.target.x, this.target.y, this.target.velocity.x, this.target.velocity.y)
            + this.getAccuracyModification();
    };
    this.getTargetLeadingVector = function () {
        return math.leadingVector(this.building.x, this.building.y, this.projectileSpeed, this.target.x, this.target.y, this.target.velocity.x, this.target.velocity.y);
    };
    this.getAccuracyModification = function () {
        if (this.accuracy == null) return 0;
        return Math.PI * (Math.random() * this.accuracy - (this.accuracy / 2));
    };
}
Weapon.prototype = Object.create(PIXI.Container.prototype);
Weapon.prototype.constructor = Weapon;

function Missile(options) {
    Weapon.call(this, options);
    this.projectileSpeed = options.projectileSpeed;
    this.explosiveSpeed = options.explosiveSpeed;
    this.explosiveTime = options.explosiveTime;
    this.explosiveInitialSize = options.explosiveInitialSize;
    this.range = options.range;
    this.damage = options.damage;
    this.fireRate = options.fireRate;
    this.fireRateCount = options.fireRate;
    this.acceleration = options.acceleration;
    this.shotSpeedVariance = options.accuracy;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage / 1.5;
    };
    this.createAttributeForStat('projectileSpeed', true, 10, 1.25, this.attributeCost);
    this.createAttributeForStat('explosiveSpeed', true, 4, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveTime', true, 10, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveInitialSize', true, 30, 1.1, this.attributeCost);
    this.createProjectile = function () {
        return new Projectiles.Missile(this);
    };
}
Missile.prototype = Object.create(Weapon.prototype);
Missile.prototype.constructor = Missile;

function Gun(options) {
    Weapon.call(this, options);
    var me = this;
    this.range = options.range;
    this.fireRate = options.fireRate;
    this.fireRateCount = options.fireRate;
    this.projectileSpeed = options.projectileSpeed;
    this.damage = options.damage;
    this.accuracy = 1 - options.accuracy;
    this.shotsPerShot = options.shotsPerShot;
    this.projectileClass = Projectiles.Bullet;
    this.weaponAttributeCost = this.attributeCost;
    this.createAttributeForStat('ProjectileSpeed', true, 10, 1.25, this.attributeCost);
    /** @return {number} **/
    this.attributeCost = function () {
        return me.weaponAttributeCost() * (1 + me.projectileSpeed / 5);
    };
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage / 2 * this.projectileSpeed / 3;
    };
    this.createProjectile = function () {
        return new this.projectileClass(this);
    };
}
Gun.prototype = Object.create(Weapon.prototype);
Gun.prototype.constructor = Gun;

function Cannon(options) {
    Gun.call(this, options);
    this.projectileClass = Projectiles.Cannon;
    this.explosiveSpeed = options.explosiveSpeed;
    this.explosiveTime = options.explosiveTime;
    this.explosiveInitialSize = options.explosiveInitialSize;
    this.gunAttributeCost = this.attributeCost;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 2 * (this.explosiveSpeed + this.explosiveTime + this.explosiveInitialSize / 20);
    };
    /** @return {number} **/
    this.attributeCost = function () {
        return this.gunAttributeCost() * (1 + (this.explosiveTime + this.explosiveSpeed + this.explosiveInitialSize / 20) / 5);
    };
    this.createAttributeForStat('explosiveSpeed', true, 4, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveTime', true, 10, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveInitialSize', true, 30, 1.1, this.attributeCost);
}
Cannon.prototype = Object.create(Weapon.prototype);
Cannon.prototype.constructor = Cannon;

function GrenadeLauncher(options) {
    var me = this;
    Gun.call(this, options);
    this.projectileClass = Projectiles.Grenade;
    this.projectileSlowFactor = options.projectileSlowFactor;
    this.explosiveSpeed = options.explosiveSpeed;
    this.explosiveTime = options.explosiveTime;
    this.explosiveInitialSize = options.explosiveInitialSize;
    this.gunAttributeCost = this.attributeCost;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 2 * (this.explosiveSpeed + this.explosiveTime + this.explosiveInitialSize / 20);
    };
    /** @return {number} **/
    this.attributeCost = function () {
        return me.gunAttributeCost() * (1 + (me.explosiveTime + me.explosiveSpeed + me.explosiveInitialSize / 20) / 5);
    };
    this.createAttributeForStat('explosiveSpeed', true, 4, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveTime', true, 10, 1.1, this.attributeCost);
    this.createAttributeForStat('explosiveInitialSize', true, 30, 1.1, this.attributeCost);
}
GrenadeLauncher.prototype = Object.create(Weapon.prototype);
GrenadeLauncher.prototype.constructor = GrenadeLauncher;

function Laser(options) {
    Weapon.call(this, options);
    this.lifespan = options.lifeSpan;
    this.range = options.range;
    this.damage = options.damage;
    this.fireRate = options.fireRate;
    this.fireRateCount = options.fireRate;
    this.accuracy = 1 - options.accuracy;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 3 / this.lifespan;
    };
    this.createProjectile = function () {
        return new Projectiles.Laser(this);
    };
}
Laser.prototype = Object.create(Weapon.prototype);
Laser.prototype.constructor = Laser;

function Shocker(options) {
    Weapon.call(this, options);
    this.lifespan = options.lifeSpan;
    this.range = options.range;
    this.damage = options.damage;
    this.fireRate = this.fireRateCount = options.fireRate;
    /** @return {number} **/
    this.getAmmoConsumption = function () {
        return this.damage * 3 / this.lifespan;
    };
    this.createProjectile = function () {
        return new Projectiles.Shock(this);
    };
}
Shocker.prototype = Object.create(Weapon.prototype);
Shocker.prototype.constructor = Shocker;
