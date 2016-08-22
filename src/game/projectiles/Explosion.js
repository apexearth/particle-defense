var PIXI = require('pixi.js');
var Settings = require('../Settings');

module.exports = Explosion;

function Explosion(particle) {
    PIXI.Container.call(this);
    particle.level.addChild(this);
    particle.level.objects.push(this);
    this.level = particle.level;
    this.position.x         = particle.position.x;
    this.position.y         = particle.position.y;
    this.explosiveSpeed = particle.explosiveSpeed;
    this.explosiveTime = particle.explosiveTime * Settings.second;
    this.explosiveTimeCount = 0;
    this.damage = particle.damage / Settings.second;
    this.radius = particle.explosiveInitialSize;
    
    // this.sprite = PIXI.createCircle('rgb(255,50,50)', 100);
    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.die    = function () {
        particle.level.objects.splice(particle.level.objects.indexOf(this), 1);
        this.level.removeChild(this);
    };
    this.update = function () {
        this.explosiveTimeCount++;
        this.radius += this.explosiveSpeed;
    
        var i = this.level.units.length;
        while (i--) {
            var unit = this.level.units[i];
            if (unit.hitTest(this)) {
                unit.damage(this.damage);
            }
        }
        if (this.explosiveTimeCount >= this.explosiveTime) {
            this.die();
        }
        this.graphics.clear();
        this.graphics.beginFill(0xFF8800, ((this.explosiveTime - this.explosiveTimeCount) / this.explosiveTime / 1.2));
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
    };
}

Explosion.prototype             = Object.create(PIXI.Container.prototype);
Explosion.prototype.constructor = Explosion;

Explosion.addExplosiveProperties = function (projectile, weapon) {
    projectile.explosiveSpeed = weapon.explosiveSpeed;
    projectile.explosiveTime = weapon.explosiveTime;
    projectile.explosiveInitialSize = weapon.explosiveInitialSize;
    projectile.inheritedOnHitExplosiveProperties = projectile.onHit;
    projectile.onHit                             = function () {
        projectile.inheritedOnHitExplosiveProperties();
        new Explosion(projectile);
    };
};
