const PIXI = require('pixi.js');
const math = require('../../util/math');
const Attribute = require('../Attribute');

const pi2 = Math.PI * 2,
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
    this.fireRate = .2;
    this.fireRateCount = .2;
    this.shotsPerShot = 1;
    this.accuracy = .05;

    var createProperty = function (parent, key, options) {
        return new Attribute(Object.assign({
            parent: parent,
            key: key,
            upgrade: {
                factor: 1.1,
                costMultiplier: 1.25,
                cost: {
                    energy: 10,
                    metal: 5
                }
            }
        }, options));
    };
    this.attributes = {
        range: createProperty(this, 'range'),
        damage: createProperty(this, 'damage'),
        fireRate: createProperty(this, 'fireRate'),
        accuracy: createProperty(this, 'accuracy', {upgrade: {factor: .9}})
    };
    /** @returns Number */
    this.attributeCost = function () {
        return (10 * this.damage / this.fireRate + this.range / 10) * (1 + 10 * this.accuracy);
    };
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
            this.level.addProjectile(projectile);
        }
    };
    this.findTarget = function () {
        var i = this.building.level.units.length;
        while (i--) {
            var unit = this.building.level.units[i];
            if (math.distance(unit.position.x - this.building.position.x, unit.position.y - this.building.position.y) <= this.range) {
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
    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        if (this.target != null && this.target.dead) {
            this.resetTarget();
        }
        if (this.target == null) {
            this.findTarget();
        } else {
            this.updateRotation();
        }

        this.fireRateCount += seconds;
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
