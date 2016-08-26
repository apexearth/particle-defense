var PIXI = require('pixi.js');
var Projectile = require('./projectile');
var math = require('../../util/math');

module.exports = ThrownProjectile;

function ThrownProjectile(weapon) {
    Projectile.call(this, weapon);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.lastPosition         = this.position;
    this.target = weapon.getTargetLeadingVector();
    this.initialDistance = math.distance(this.position.x - this.target.position.x, this.position.y - this.target.position.y);
    this.direction = math.angle(this.position.x, this.position.y, this.target.position.x, this.target.position.y);
    this.initialVelocity = weapon.projectileSpeed;
    this.currentVelocity = weapon.projectileSpeed;
    this.projectileSlowFactor = weapon.projectileSlowFactor;
    this.projectileUpdate     = this.update;
    this.update               = function () {
        this.projectileUpdate();
        this.lastPosition = this.position.clone();
        if (this.distance == null || this.distance > this.width) {
            this.distance = math.Distance(this.position.x - this.target.position.x, this.position.y - this.target.position.y);
            this.currentVelocity = this.initialVelocity * (Math.pow(this.distance + 25, this.projectileSlowFactor) * 2 / Math.pow(this.initialDistance, this.projectileSlowFactor));
            this.velocity.x = Math.cos(this.direction) * this.currentVelocity;
            this.velocity.y = Math.sin(this.direction) * this.currentVelocity;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
        this.graphics.clear();
        this.graphics.lineStyle(this.width, 0xFFFFFF, .5);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(this.lastPosition.x - this.position.x, this.lastPosition.y - this.position.y);
        this.graphics.lineStyle(0, 0xFFFFFF, 0);
        this.graphics.beginFill(0xFFFFFF, 1);
        this.graphics.drawRect(0, 0, this.width, this.width);
        this.graphics.endFill();
    };
    this.hitTest              = function (unit) {
        if (this.position.x - this.lastPosition.x > 1 && this.position.y - this.lastPosition.y > 1) {
            return unit.hitTestLine(this.position, this.lastPosition, this.width);
        } else {
            return unit.hitTest(this, this.width);
        }
    };
}

ThrownProjectile.prototype             = Object.create(PIXI.Container.prototype);
ThrownProjectile.prototype.constructor = ThrownProjectile;
