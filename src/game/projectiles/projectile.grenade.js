var PIXI             = require("pixi.js")
var ThrownProjectile = require("./projectile.thrown")
var Explosion        = require("./explosion")

module.exports = GrenadeProjectile

function GrenadeProjectile(weapon) {
    ThrownProjectile.call(this, weapon);
    Explosion.addExplosiveProperties(this, weapon);
}

GrenadeProjectile.prototype             = Object.create(PIXI.Container.prototype);
GrenadeProjectile.prototype.constructor = GrenadeProjectile;
