var PIXI = require('pixi.js');
var Settings = require('../Settings');

module.exports = Projectile;

function Projectile(options) {
    PIXI.Container.call(this);
    if (!options.level) throw new Error('Projectiles require a level option to be created.');
    if (!options.player) throw new Error('Projectiles require a player option to be created.');
    if (!options.direction) throw new Error('Projectiles require a direction option to be created.');
    if (!options.velocity) throw new Error('Projectiles require a direction option to be created.');
    if (!options.position) throw new Error('Projectiles require a position option to be created.');
    if (!options.damage) throw new Error('Projectiles require a damage option to be created.');
    this.level = options.level;
    this.player = options.player;
    this.direction = options.direction;
    this.initialVelocity = options.velocity;
    this.position.x = options.position.x;
    this.position.y = options.position.y;
    this.damage = options.damage;
    this.velocity = {
        x: Math.cos(this.direction) * this.initialVelocity,
        y: Math.sin(this.direction) * this.initialVelocity
    };

    this.level.addProjectile(this);
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
