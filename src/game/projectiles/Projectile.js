var PIXI = require('pixi.js');
var Settings = require('../Settings');

module.exports = Projectile;

function Projectile(options) {
    if (!options.level) throw new Error('Projectiles require a level option to be created.');
    if (!options.player) throw new Error('Projectiles require a player option to be created.');
    if (options.direction == null) throw new Error('Projectiles require a direction option to be created.');
    if (options.velocity == null) throw new Error('Projectiles require a velocity option to be created.');
    if (!options.position) throw new Error('Projectiles require a position option to be created.');
    if (options.damage == null) throw new Error('Projectiles require a damage option to be created.');
    this.container = new PIXI.Container();
    this.level = options.level;
    this.player = options.player;
    this.direction = options.direction;
    this.initialVelocity = options.velocity;
    Object.defineProperty(this, 'position', {
        get: function () {
            return this.container.position;
        }.bind(this)
    });
    this.position.x = options.position.x;
    this.position.y = options.position.y;
    this.damage = options.damage;
    this.velocity = {
        x: Math.cos(this.direction) * this.initialVelocity,
        y: Math.sin(this.direction) * this.initialVelocity
    };

    /**
     * @param unit Unit
     * @returns Number **/
    this.effectiveDamage = function (unit) {
        if (!unit) throw new Error('The unit parameter is required'); // For subclass overrides.
        return this.damage;
    };
    this.width = 1;
    this.radius = this.width;
    this.lifespan = 5;
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

    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        this.lifespanCount += seconds;
        if (this.lifespanCount > this.lifespan) this.die();
        if (!this.level.hitTest(this.position)) { // Die if outside of level.
            this.onHit();
        } else {
            this.unitHitCheck();
        }
    };
    this.hitTest = function (unit) {
        return unit.hitTest(this.position, this.width);
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
