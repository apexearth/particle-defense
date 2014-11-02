define("game/Projectiles", ["./PIXI", "./Images", "game/Settings", "util/General"], function (PIXI, Images, Settings, General) {
        var arcCircle = 2 * Math.PI;

        function ExplosiveProperties(weapon) {
            this.ExplosiveSpeed = weapon.ExplosiveSpeed;
            this.ExplosiveTime = weapon.ExplosiveTime;
            this.ExplosiveInitialSize = weapon.ExplosiveInitialSize;
            this.inheritedOnHitExplosiveProperties = this.onHit;
            this.onHit = function () {
                this.inheritedOnHitExplosiveProperties();
                var explosion = new Explosion.Basic(this);
            };
        }

        function Projectile(weapon) {
            this.canvas = Images.Pixel;
            this.sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
            this.addChild(this.sprite);
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
                this.Level.removeChild(this);
                this.Level.Projectiles.splice(this.Level.Projectiles.indexOf(this), 1);
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

        function VelocityProjectile(weapon) {
            Projectile.call(this, weapon);
            this.LastX = this.position.x;
            this.LastY = this.position.y;
            this.Direction = weapon.getTargetLeadingAngle();
            this.InitialVelocity = weapon.ProjectileSpeed;
            this.VelocityX = Math.cos(this.Direction) * this.InitialVelocity;
            this.VelocityY = Math.sin(this.Direction) * this.InitialVelocity;
            this.Width = Math.sqrt(this.Damage) * 2 / this.InitialVelocity * 3;
            this.projectileUpdate = this.update;
            this.update = function () {
                this.projectileUpdate();
                this.LastX = this.position.x;
                this.LastY = this.position.y;
                this.position.x += this.VelocityX;
                this.position.y += this.VelocityY;
                this.rotation = this.Direction;
                this.scale.x = this.Width;
                this.scale.y = this.InitialVelocity;
            };
            this.hitTest = function (unit) {
                return unit.hitTestLine({x: this.position.x, y: this.position.y}, {
                    x: this.LastX,
                    y: this.LastY
                }, this.Width);
            };
            this.draw = function (context) {
                context.save();
                context.strokeStyle = '#fff';
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.position.x, this.position.y);
                context.lineTo(this.LastX, this.LastY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        }

        function MissileProjectile(weapon) {
            AcceleratingProjectile.call(this, weapon);
            ExplosiveProperties.call(this, weapon);
            this.Target = weapon.Target;
            this.Damage = weapon.Damage;
            this.Width = Math.sqrt(this.Damage);
            this.ExplodeRange = this.Width * 3;
            this.hitTest = function (unit) {
                return unit.hitTestLine({x: this.position.x, y: this.position.y}, {
                    x: this.LastX,
                    y: this.LastY
                }, this.ExplodeRange);
            };
            this.inheritedUpdateMissileProjectile = this.update;
            this.update = function () {
                if (this.Target !== null) {
                    if (this.Target.IsDead) this.Target = null;
                    if (this.Target !== null) {
                        var expectedAverageVelocity = this.Acceleration * General.Distance(this.position.x - this.Target.x, this.position.y - this.Target.y) / 2 + this.CurrentVelocity;
                        this.Direction = General.LeadingAngleRad(this.position.x, this.position.y, expectedAverageVelocity, this.Target.x, this.Target.y, this.Target.VelocityX, this.Target.VelocityY);
                    }
                }
                this.inheritedUpdateMissileProjectile();
            };
            this.draw = function (context) {
                context.save();
                context.strokeStyle = '#f88';
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.position.x, this.position.y);
                context.lineTo(this.LastX, this.LastY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        }

        function ThrownProjectile(weapon) {
            Projectile.call(this, weapon);
            this.LastX = this.position.x;
            this.LastY = this.position.y;
            this.Target = weapon.getTargetLeadingVector();
            this.InitialDistance = General.Distance(this.position.x - this.Target.x, this.position.y - this.Target.y);
            this.Direction = General.AngleRad(this.position.x, this.position.y, this.Target.x, this.Target.y);
            this.InitialVelocity = weapon.ProjectileSpeed;
            this.CurrentVelocity = weapon.ProjectileSpeed;
            this.ProjectileSlowFactor = weapon.ProjectileSlowFactor;
            this.projectileUpdate = this.update;
            this.update = function () {
                this.projectileUpdate();
                this.LastX = this.position.x;
                this.LastY = this.position.y;
                if (this.Distance == null || this.Distance > this.Width) {
                    this.Distance = General.Distance(this.position.x - this.Target.x, this.position.y - this.Target.y);
                    this.CurrentVelocity = this.InitialVelocity * (Math.pow(this.Distance + 25, this.ProjectileSlowFactor) * 2 / Math.pow(this.InitialDistance, this.ProjectileSlowFactor));
                    this.VelocityX = Math.cos(this.Direction) * this.CurrentVelocity;
                    this.VelocityY = Math.sin(this.Direction) * this.CurrentVelocity;
                    this.position.x += this.VelocityX;
                    this.position.y += this.VelocityY;
                }
            };
            this.hitTest = function (unit) {
                if (this.position.x !== this.LastX && this.position.y !== this.LastY) {
                    return unit.hitTestLine({x: this.position.x, y: this.position.y}, {
                        x: this.LastX,
                        y: this.LastY
                    }, this.Width);
                } else {
                    return unit.hitTest(this);
                }
            };
        }

        function CannonProjectile(weapon) {
            VelocityProjectile.call(this, weapon);
            ExplosiveProperties.call(this, weapon);

            this.draw = function (context) {
                context.save();
                context.strokeStyle = '#fff';
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.position.x, this.position.y);
                context.lineTo(this.LastX, this.LastY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        }

        function GrenadeProjectile(weapon) {
            ThrownProjectile.call(this, weapon);
            ExplosiveProperties.call(this, weapon);

            this.draw = function (context) {
                if (this.position.x !== this.LastX && this.position.y !== this.LastY) {
                    context.save();
                    context.strokeStyle = '#fff';
                    context.lineWidth = this.Width;
                    context.lineCap = "round";
                    context.beginPath();
                    context.moveTo(this.position.x, this.position.y);
                    context.lineTo(this.LastX, this.LastY);
                    context.stroke();
                    context.closePath();
                    context.restore();
                } else {
                    context.fillStyle = '#fff';
                    context.fillRect(this.position.x - this.Width / 2, this.position.y - this.Width / 2, this.Width, this.Width);
                }
            };
        }

        function AcceleratingProjectile(weapon) {
            VelocityProjectile.call(this, weapon);
            this.Acceleration = weapon.Acceleration;
            this.velocityProjectileUpdate = this.update;
            this.update = function () {
                this.velocityProjectileUpdate();
                this.VelocityX += Math.cos(this.Direction) * this.Acceleration;
                this.VelocityY += Math.sin(this.Direction) * this.Acceleration;
            };
        }

        function BeamProjectile(weapon) {
            Projectile.call(this, weapon);
            this.Lifespan = weapon.Lifespan;
            this.FadeTime = weapon.Lifespan / 2;
            this.FadeTimeCount = 0;
            this.Damage = weapon.Damage / weapon.Lifespan;
            this.Width = weapon.Damage * 10 / weapon.Lifespan;
            this.Direction = weapon.getTargetAngle();
            this.EndX = this.position.x + Math.cos(this.Direction) * this.Weapon.Range;
            this.EndY = this.position.y + Math.sin(this.Direction) * this.Weapon.Range;
            /** @returns Number */
            this.EffectiveDamage = function (unit) {
                return this.Damage * General.Distance(this.position.x - unit.x, this.position.y - unit.y) / this.Weapon.Range;
            };

            this.projectileUpdate = this.update;
            this.update = function () {
                if (this.LifespanCount > this.Lifespan - this.FadeTime) this.FadeTimeCount++;
                this.projectileUpdate();
            };
            this.onHit = function () {
                // Nothing
            };
            this.hitTest = function (unit) {
                return unit.hitTestLine({x: this.position.x, y: this.position.y}, {
                    x: this.EndX,
                    y: this.EndY
                }, this.Width);
            };

            this.draw = function (context) {
                context.save();
                context.globalAlpha = Math.max(1, this.FadeTime - this.FadeTimeCount) / (this.FadeTime / 2);
                var grad = context.createLinearGradient(this.position.x, this.position.y, this.EndX, this.EndY);
                grad.addColorStop(0, '#77f');
                grad.addColorStop(1, '#227');
                context.strokeStyle = grad;
                context.lineWidth = this.Width;
                context.lineCap = "square";
                context.beginPath();
                context.moveTo(this.position.x, this.position.y);
                context.lineTo(this.EndX, this.EndY);
                context.stroke();
                context.closePath();
                context.restore();
            };
        }

        function ShockProjectile(weapon) {
            Projectile.call(this, weapon);

            this.Lifespan = Settings.Second / 3;
            this.Width = this.Damage * 10 / this.Lifespan;
            this.Range = weapon.Range;

            /** @returns Number */
            this.EffectiveDamage = function (depth) {
                return this.Damage / this.Lifespan / this.getDepthDecay(depth);
            };
            this.getDepthDecay = function (depth) {
                return 1 + depth / 3;
            };
            this.unitHitCheck = function (connection) {
                if (connection == null) connection = this.Connection;
                if (connection.unit !== null) connection.unit.damage(this.EffectiveDamage(connection.depth));
                var i = connection.array.length;
                while (i--) this.unitHitCheck(connection.array[i]);
            };

            this.ConnectedUnits = [];
            this.Connection = {
                array: [],
                unit: null,
                x: this.position.x,
                y: this.position.y,
                depth: 0
            };
            this.updateConnections = function (depth, connection) {
                if (depth == null) depth = 0;
                if (connection == null) connection = this.Connection;
                if (connection.unit == null) {
                    connection.x = this.position.x;
                    connection.y = this.position.y;
                } else {
                    connection.x = connection.unit.x;
                    connection.y = connection.unit.y;
                    if (connection.unit.IsDead) {
                        connection.unit = null;
                        connection.array = [];
                    }
                }

                var i = this.Level.Units.length;
                while (i--) {
                    var unit = this.Level.Units[i];
                    if (this.ConnectedUnits.indexOf(unit) === -1) {
                        var distance = General.Distance(connection.x - unit.x, connection.y - unit.y);
                        var range = this.Range / this.getDepthDecay(depth);
                        if (distance < range) {
                            connection.array.push({
                                array: [],
                                unit: unit,
                                x: unit.x,
                                y: unit.y,
                                depth: depth
                            });
                            this.ConnectedUnits.push(unit);
                        }
                    }
                }

                i = connection.array.length;
                while (i--) this.updateConnections(depth + 1, connection.array[i]);
            };

            this.projectileUpdate = this.update;
            this.update = function () {
                this.projectileUpdate();
                this.updateConnections();
            };

            this.draw = function (context) {
                context.strokeStyle = 'rgba(150,150,255,' + (1 - this.LifespanCount / this.Lifespan) + ')';
                this.drawConnection(context, this.Connection, null);
                context.fillRect(this.position.x - 1, this.position.y - 1, 2, 2);
            };
            this.drawConnection = function (context, connection, parentConnection) {
                var i = connection.array.length;
                var wild = Math.sqrt(this.Damage) * 5;
                while (i--) this.drawConnection(context, connection.array[i], connection);
                if (parentConnection !== null && !isNaN(connection.x) && !isNaN(connection.y) && !isNaN(parentConnection.x) && !isNaN(parentConnection.y)) {
                    context.beginPath();
                    var px = parentConnection.x;
                    var py = parentConnection.y;
                    context.moveTo(px, py);
                    var x = parentConnection.x;
                    var y = parentConnection.y;
                    while (x != connection.x || y != connection.y) {

                        x += (connection.x - x) * .2 + (connection.x - x) * .25 * Math.random() * Math.random() + (Math.random() * wild * 2 - wild);
                        y += (connection.y - y) * .2 + (connection.y - y) * .25 * Math.random() * Math.random() + (Math.random() * wild * 2 - wild);

                        if (Math.abs(x - connection.x) < wild * 3 && Math.abs(y - connection.y) < wild * 3) {
                            x = connection.x;
                            y = connection.y;
                        }

                        context.lineTo(x, y);
                        px = x;
                        py = y;
                    }
                    context.stroke();
                    context.closePath();
                }
            }
        }

        var Explosion = {
            Basic: function (particle) {
                particle.Level.Objects.push(this);
                this.Level = particle.Level;
                this.position.x = particle.x;
                this.position.y = particle.y;
                this.ExplosiveSpeed = particle.ExplosiveSpeed;
                this.ExplosiveTime = particle.ExplosiveTime * Settings.Second;
                this.ExplosiveTimeCount = 0;
                this.Damage = particle.Damage / Settings.Second;
                this.Radius = particle.ExplosiveInitialSize;

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
                        particle.Level.Objects.splice(particle.Level.Objects.indexOf(this), 1);
                    }
                };

                this.draw = function (context) {
                    var alpha = ((this.ExplosiveTime - this.ExplosiveTimeCount) / this.ExplosiveTime / 1.2);
                    context.fillStyle = 'rgba(255,50,50,' + alpha + ')';
                    context.beginPath();
                    context.arc(this.position.x, this.position.y, this.Radius, 0, arcCircle, false);
                    context.fill();
                    context.closePath();
                };
            }
        };

        function SpriteWrapper(func) {
            return function (weapon) {
                var projectile = new PIXI.DisplayObjectContainer();
                weapon.Level.addChild(projectile);
                func.call(projectile, weapon);
                return projectile;
            };
        }

        return {
            Laser: SpriteWrapper(BeamProjectile),
            Bullet: SpriteWrapper(VelocityProjectile),
            ExplosiveBullet: SpriteWrapper(CannonProjectile),
            Grenade: SpriteWrapper(GrenadeProjectile),
            Missile: SpriteWrapper(MissileProjectile),
            Shock: SpriteWrapper(ShockProjectile)
        }
    }
);
