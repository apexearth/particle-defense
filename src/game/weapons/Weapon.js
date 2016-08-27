var PIXI = require('pixi.js');
var math = require('../../util/math');
var Attribute = require('../Attribute');

var pi2 = Math.PI * 2,
    degree = pi2 / 360;

module.exports = Weapon;

function Weapon(options) {
    PIXI.Container.call(this);

    if (!options.level) throw new Error('Weapons require a level option to be created.');
    if (!options.building) throw new Error('Weapons require a building option to be created.');
    this.name = this.constructor.name;
    this.level = options.level;
    this.building = options.building;
    this.player = this.building.player;

    this.position.x = this.building.position.x;
    this.position.y = this.building.position.y;

    this.range = 200;
    this.damage = 1;
    this.firingCode = degree * 15;
    this.rotateSpeed = degree * 5;
    this.getTargetAngle = function () {
        if (this.target == null) return NaN;
        return math.angle(this.building.position.x, this.building.position.y, this.target.position.x, this.target.position.y);
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
            if (math.distance(unit.x - this.building.position.x, unit.y - this.building.position.y) <= this.range) {
                this.target = unit;
            }
        }
    };

    this.tryFireAtTarget = function () {
        if (math.distance(this.target.position.x - this.building.position.x, this.target.position.y - this.building.position.y) > this.range) {
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
        return math.angle(this.building.position.x, this.building.position.y, this.target.position.x, this.target.position.y)
            + this.getAccuracyModification();
    };
    this.getTargetLeadingAngle = function () {
        return math.leadingAngle(this.building.position.x, this.building.position.y, this.projectileSpeed, this.target.position.x, this.target.position.y, this.target.velocity.x, this.target.velocity.y)
            + this.getAccuracyModification();
    };
    this.getTargetLeadingVector = function () {
        return math.leadingVector(this.building.position.x, this.building.position.y, this.projectileSpeed, this.target.position.x, this.target.position.y, this.target.velocity.x, this.target.velocity.y);
    };
    this.getAccuracyModification = function () {
        if (this.accuracy == null) return 0;
        return Math.PI * (Math.random() * this.accuracy - (this.accuracy / 2));
    };
}
Weapon.prototype = Object.create(PIXI.Container.prototype);
Weapon.prototype.constructor = Weapon;
