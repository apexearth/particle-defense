define(["../PIXI", "../Settings"], function (PIXI, Settings) {
    function Explosion(particle) {
        PIXI.DisplayObjectContainer.call(this);
        particle.Level.addChild(this);
        particle.Level.Objects.push(this);
        this.Level = particle.Level;
        this.position.x = particle.position.x;
        this.position.y = particle.position.y;
        this.ExplosiveSpeed = particle.ExplosiveSpeed;
        this.ExplosiveTime = particle.ExplosiveTime * Settings.Second;
        this.ExplosiveTimeCount = 0;
        this.Damage = particle.Damage / Settings.Second;
        this.Radius = particle.ExplosiveInitialSize;

        // this.sprite = PIXI.createCircle("rgb(255,50,50)", 100);
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.die = function () {
            particle.Level.Objects.splice(particle.Level.Objects.indexOf(this), 1);
            this.Level.removeChild(this);
        };
        this.update = function () {
            this.ExplosiveTimeCount++;
            this.Radius += this.ExplosiveSpeed;

            var i = this.Level.Units.length;
            while (i--) {
                var unit = this.Level.Units[i];
                if (unit.hitTest(this)) {
                    unit.damage(this.Damage);
                }
            }
            if (this.ExplosiveTimeCount >= this.ExplosiveTime) {
                this.die();
            }
            this.graphics.clear();
            this.graphics.beginFill(0xFF8800, ((this.ExplosiveTime - this.ExplosiveTimeCount) / this.ExplosiveTime / 1.2));
            this.graphics.drawCircle(0, 0, this.Radius);
            this.graphics.endFill();
        }
    }

    Explosion.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Explosion.prototype.constructor = Explosion;

    Explosion.addExplosiveProperties = function (projectile, weapon) {
        projectile.ExplosiveSpeed = weapon.ExplosiveSpeed;
        projectile.ExplosiveTime = weapon.ExplosiveTime;
        projectile.ExplosiveInitialSize = weapon.ExplosiveInitialSize;
        projectile.inheritedOnHitExplosiveProperties = projectile.onHit;
        projectile.onHit = function () {
            projectile.inheritedOnHitExplosiveProperties();
            new Explosion(projectile);
        };
    };

    return Explosion;
});