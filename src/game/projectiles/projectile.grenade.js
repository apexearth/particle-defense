define(["../PIXI","./projectile.thrown", "./explosion"], function (PIXI, ThrownProjectile, Explosion) {
    function GrenadeProjectile(weapon) {
        ThrownProjectile.call(this, weapon);
        Explosion.addExplosiveProperties(this, weapon);
    }

    GrenadeProjectile.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    GrenadeProjectile.prototype.constructor = GrenadeProjectile;
    return GrenadeProjectile;
});
