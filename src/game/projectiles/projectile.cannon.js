define(["../PIXI","./projectile.velocity", "./explosion"], function (PIXI, VelocityProjectile, Explosion) {
    function CannonProjectile(weapon) {
        VelocityProjectile.call(this, weapon);
        Explosion.addExplosiveProperties(this, weapon);
}

    CannonProjectile.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    CannonProjectile.prototype.constructor = CannonProjectile;
    return CannonProjectile;

});