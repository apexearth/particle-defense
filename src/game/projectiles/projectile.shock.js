define(["../PIXI","./projectile", "../Settings"], function(PIXI, Projectile, Settings){
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
    ShockProjectile.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    ShockProjectile.prototype.constructor = ShockProjectile;
    return ShockProjectile;

});