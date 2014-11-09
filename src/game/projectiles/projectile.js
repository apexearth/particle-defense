define(["../PIXI", "../Settings"], function (PIXI, Settings) {
    function Projectile(weapon) {
        PIXI.DisplayObjectContainer.call(this);
        weapon.Level.addChild(this);
        this.Level = weapon.Building.Level;
        this.Building = weapon.Building;
        this.Weapon = weapon;
        this.position.x = weapon.Building.position.x;
        this.position.y = weapon.Building.position.y;
        this.Damage = weapon.Damage;
        /** @returns Number **/
        this.EffectiveDamage = function (unit) {
            return this.Damage;
        };
        this.Width = 1;
        this.Radius = this.Width;
        this.Lifespan = Settings.Second * 5;
        this.LifespanCount = 0;
        this.IsDead = false;

        this.die = function () {
            this.IsDead = true;
            this.Level.Projectiles.splice(this.Level.Projectiles.indexOf(this), 1);
            this.Level.removeChild(this);
        };

        this.onHit = function () {
            this.die();
        };

        this.update = function () {
            if (this.LifespanCount++ > this.Lifespan) this.die();
            if (!this.Level.hitTest(this)) // Die if outside of level.
            {
                this.onHit();
            } else {
                this.unitHitCheck();
            }
        };
        this.hitTest = function (unit) {
            return unit.hitTest(this);
        };
        this.unitHitCheck = function () {
            var u = this.Level.Units.length;
            while (u--) {
                var unit = this.Level.Units[u];
                if (this.hitTest(unit)) {
                    unit.damage(this.EffectiveDamage(unit));
                    this.onHit();
                }
            }
        };
    }

    Projectile.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Projectile.prototype.constructor = Projectile;
    return Projectile;
});