define(["./projectile.beam", "./projectile.velocity", "./projectile.cannon", "./projectile.grenade", "./projectile.missile", "./projectile.shock"],
    function (Laser,Bullet,Cannon,Grenade,Missile,Shock) {

        return {
            Laser: Laser,
            Bullet: Bullet,
            Cannon: Cannon,
            Grenade: Grenade,
            Missile: Missile,
            Shock: Shock
        };

    }
);
