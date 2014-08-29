define("game/Projectiles", ["game/Settings"], function (Settings) {
    function Projectile(level, x, y) {
        this.Level = level;
        this.X = x;
        this.Y = y;
        this.Damage = 1;
        this.Radius = 1;
        this.Lifespan = Settings.Second * 60;
        this.LifespanCount = 0;
        this.die = function () {
            this.Level.Projectiles.splice(this.Level.Projectiles.indexOf(this), 1);
        }
        this.onHit = function () {
            this.die();
        }

        this.draw = function (context) {
            context.fillStyle = '#aaa';
            context.fillRect(this.X - 1, this.Y - 1, 2, 2);
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
        }
        this.unitHitCheck = function () {
            var u = this.Level.Units.length;
            while (u--) {
                var unit = this.Level.Units[u];
                if (this.hitTest(unit)) {
                    unit.damage(this.Damage);
                    if (this.onHit != null) this.onHit();
                }
            }
        };
    }

    return {
        Projectile: Projectile,
        Laser: function (level, x, y, direction) {
            Projectile.call(this, level, x, y);
            this.Lifespan = Settings.Second;
            this.FadeTime = Settings.Second / 2;
            this.FadeTimeCount = 0;
            this.Direction = direction;
            this.Radius = 1;
            this.EndX = this.X + Math.cos(this.Direction) * 100;
            this.EndY = this.Y + Math.sin(this.Direction) * 100;

            this.inheritedUpdate = this.update;
            this.update = function () {
                if (this.LifespanCount > this.Lifespan - this.FadeTime) this.FadeTimeCount++;
                this.inheritedUpdate();
            };
            this.onHit = function () {
                // Nothing
            };
            this.hitTest = function (unit) {
                return unit.hitTestLine({X: this.X, Y: this.Y}, {X: this.EndX, Y: this.EndY});
            };
            this.draw = function (context) {
                context.save();
                context.globalAlpha = Math.max(1, this.FadeTime - this.FadeTimeCount) / this.FadeTime;
                context.strokeStyle = '#77f';
                context.lineWidth = this.Radius * 2;
                context.beginPath();
                context.moveTo(this.X, this.Y);
                context.lineTo(this.EndX, this.EndY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        },
        Bullet: function (level, x, y, direction) {
            Projectile.call(this, level, x, y);
            this.Direction = direction;
            this.Speed = 1;
            this.Radius = 1;
            this.Length = 2;
            this.inheritedUpdate = this.update;
            this.update = function () {
                this.inheritedUpdate();
                this.X += Math.cos(this.Direction) * this.Speed;
                this.Y += Math.sin(this.Direction) * this.Speed;
                this.EndX = this.X + Math.cos(this.Direction) * this.Length;
                this.EndY = this.Y + Math.sin(this.Direction) * this.Length;
            };
            this.onHit = function () {
                this.die();
            };
            this.hitTest = function (unit) {
                return unit.hitTest(this);
            };
            this.draw = function (context) {
                context.strokeStyle = '#aaa';
                context.lineWidth = this.Radius * 2;
                context.beginPath();
                context.moveTo(this.X, this.Y);
                context.lineTo(this.EndX, this.EndY);
                context.stroke();
                context.closePath();
            };
        }
    };
});
