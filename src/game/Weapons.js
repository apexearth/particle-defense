define("game/Weapons", ["game/Projectiles", "util/General", "game/Settings"], function (Projectiles, General, Settings) {
    function Weapon(building) {
        this.Building = building;
        this.Range = 200;
        this.AmmoConsumption = 1;
        this.FireRate = 10;
        this.FireRateCount = 10;
        this.ShotsPerShot = 1;
        this.ShotSpread = .05;
        this.Projectile = Projectiles.Bullet;

        this.ProjectileCustomization = {};

        this.ResetTarget = function () {
            this.Target = null;
        };
        this.ResetTarget();
        this.CreateProjectile = function () {
            var angle = (this.Projectile === Projectiles.Bullet
                ? this.leadTargetAngle()
                : General.AngleRad(this.Building.X, this.Building.Y, this.Target.X, this.Target.Y));
            var projectile = new this.Projectile(
                this.Building.Level,
                this.Building.X,
                this.Building.Y,
                angle * (Math.random() * this.ShotSpread + (1 - this.ShotSpread / 2))
            );
            this.ProjectileCustomization(projectile);
            return projectile;
        };
        this.fire = function () {
            this.Building.Player.Resources.Ammo -= this.AmmoConsumption;
            var shots = this.ShotsPerShot;
            while (shots--) {
                var projectile = this.CreateProjectile();
                this.Building.Level.Projectiles.push(projectile);
            }
        };
        this.update = function () {
            if (this.Target != null && this.Target.Health <= 0) {
                this.ResetTarget();
            }
            if (this.Target == null) {
                var i = this.Building.Level.Units.length;
                while (i--) {
                    var unit = this.Building.Level.Units[i];
                    if (General.Distance(unit.X - this.Building.X, unit.Y - this.Building.Y) < this.Range) {
                        this.Target = unit;
                    }
                }
            }

            if (this.FireRateCount < this.FireRate) this.FireRateCount++;
            if (this.Target != null
                && this.FireRateCount >= this.FireRate
                && this.Building.Player.Resources.Ammo >= this.AmmoConsumption) {
                this.fire();
                this.FireRateCount = 0;
            }
        };
        this.leadTargetAngle = function () {
            var velocityX = this.Target.VelocityX;
            var velocityY = this.Target.VelocityY;
            var a = Math.pow(velocityX, 2) + Math.pow(velocityY, 2) - Math.pow(this.ProjectileSpeed, 2);
            var b = 2 * (velocityX * (this.Target.X - this.Building.X) + velocityY * (this.Target.Y - this.Building.Y));
            var c = Math.pow(this.Target.X - this.Building.X, 2) + Math.pow(this.Target.Y - this.Building.Y, 2);
            var disc = Math.pow(b, 2) - 4 * a * c;
            var t1 = (-b + Math.sqrt(disc)) / (2 * a);
            var t2 = (-b - Math.sqrt(disc)) / (2 * a);
            var t = (t1 < t2 && t1 > 0 ? t1 : t2);
            var aimTargetX = t * velocityX + this.Target.X;
            var aimTargetY = t * velocityY + this.Target.Y;
            var angle = General.AngleRad(this.Building.X, this.Building.Y, aimTargetX, aimTargetY);
            return angle;
        }
    }

    return {
        Gun: function (building) {
            Weapon.call(this, building);
            this.Projectile = Projectiles.Bullet;
            this.Range = 100;
            this.AmmoConsumption = 2.5;
            this.FireRate = this.FireRateCount = 10;
            this.ProjectileSpeed = 3;
            this.ShotSpeedVariance = .2;
            this.ProjectileCustomization = function(projectile){
                projectile.Speed = this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2));
                projectile.Damage = 5;
                projectile.Width = 2.5;
            }
        },
        Autogun: function (building) {
            Weapon.call(this, building);
            this.Projectile = Projectiles.Bullet;
            this.Range = 100;
            this.AmmoConsumption = 1.5;
            this.FireRate = this.FireRateCount = 5;
            this.ProjectileSpeed = 4;
            this.ShotSpeedVariance = .2;
            this.ProjectileCustomization = function(projectile){
                projectile.Speed = 4 * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2));
                projectile.Damage = 3;
                projectile.Width = 1.5;
            }
        },
        Cannon: function (building) {
            Weapon.call(this, building);
            this.Projectile = Projectiles.Bullet;
            this.Range = 100;
            this.AmmoConsumption = 2;
            this.FireRate = this.FireRateCount = 30;
            this.ProjectileSpeed = 2.3;
            this.ShotSpeedVariance = .2;
            this.ProjectileCustomization = function(projectile){
                projectile.Speed = 2.3 * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2));
                projectile.Damage = 10;
                projectile.Width = 5;
            }
        },
        Shotgun: function (building) {
            Weapon.call(this, building);
            this.Projectile = Projectiles.Bullet;
            this.Range = 100;
            this.Damage = 5;
            this.ShotsPerShot = 5;
            this.ShotSpeedVariance = .05;
            this.AmmoConsumption = 12.5;
            this.Radius = this.Damage / 2;
            this.FireRate = this.FireRateCount = 60;
            this.ProjectileSpeed = 2.3;
            this.ShotSpeedVariance = .2;
            this.ProjectileCustomization = function(projectile){
                projectile.Speed = this.ProjectileSpeed * (Math.random() * this.ShotSpeedVariance + (1 - this.ShotSpeedVariance / 2));
                projectile.Damage = this.Damage;
                projectile.Radius = this.Radius;
            }
        },
        Laser: function (building) {
            Weapon.call(this, building);
            this.Projectile = Projectiles.Laser;
            this.Lifespan = Settings.Second;
            this.Range = 100;
            this.ShotsPerShot = 1;
            this.AmmoConsumption = 5;
            this.FireRate = this.FireRateCount = Settings.Second * 2;
            this.ProjectileCustomization = function(projectile){
                projectile.Radius = 2;
                projectile.Damage = 11.4;
            }
        }
    };
});