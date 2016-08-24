var PIXI = require('pixi.js');
var Settings = require('../Settings');

module.exports = Projectile;

function Projectile(weapon) {
    PIXI.Container.call(this);
    weapon.level.addProjectile(this);
    this.level = weapon.building.level;
    this.building = weapon.building;
    this.weapon = weapon;
    this.position.x = weapon.building.position.x;
    this.position.y = weapon.building.position.y;
    this.damage = weapon.damage;
    /** @returns Number **/
    this.effectiveDamage = function (/*unit*/) {
        return this.damage;
    };
    this.width = 1;
    this.radius = this.width;
    this.lifespan = Settings.second * 5;
    this.lifespanCount = 0;
    this.dead = false;

    this.die = function () {
        if (this.dead) return;
        this.dead = true;
        this.level.removeProjectile(this);
    };

    this.onHit = function () {
        this.die();
    };

    this.update       = function () {
        if (this.lifespanCount++ > this.lifespan) this.die();
        if (!this.level.hitTest(this)) // Die if outside of level.
        {
            this.onHit();
        } else {
            this.unitHitCheck();
        }
    };
    this.hitTest      = function (unit) {
        return unit.hitTest(this);
    };
    this.unitHitCheck = function () {
        var u = this.level.units.length;
        while (u--) {
            var unit = this.level.units[u];
            if (this.hitTest(unit)) {
                unit.damage(this.effectiveDamage(unit));
                this.onHit();
            }
        }
    };
}

Projectile.prototype             = Object.create(PIXI.Container.prototype);
Projectile.prototype.constructor = Projectile;
