var PIXI       = require("pixi.js")
var Projectile = require("./projectile")
var Settings   = require("../Settings")
var math       = require("../../util/math")

module.exports = ShockProjectile

function ShockProjectile(weapon) {
    Projectile.call(this, weapon);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    // Vars
    this.Lifespan       = Settings.Second / 3;
    this.Width          = this.Damage * 5 / this.Lifespan;
    this.Range          = weapon.Range;
    this.ConnectedUnits = [];
    this.Connection     = {
        array: [],
        unit:  null,
        x:     this.position.x,
        y:     this.position.y,
        depth: 0
    };

    /** @returns Number */
    this.EffectiveDamage = function (depth) {
        return this.Damage / this.Lifespan / this.getDepthDecay(depth);
    };
    this.getDepthDecay = function (depth) {
        return 1 + depth / 3;
    };
    this.unitHitCheck  = function (connection) {
        if (connection == null) connection = this.Connection;
        if (connection.unit !== null) connection.unit.damage(this.EffectiveDamage(connection.depth));
        var i = connection.array.length;
        while (i--) this.unitHitCheck(connection.array[i]);
    };

    this.updateConnections = function (depth, connection) {
        if (depth == null) depth = 0;
        if (connection == null) connection = this.Connection;
        if (connection.unit == null) {
            connection.x = this.position.x;
            connection.y = this.position.y;
        } else {
            if (connection.unit.IsDead) {
                connection.unit  = null;
                connection.array = [];
            } else {
                connection.x = connection.unit.position.x;
                connection.y = connection.unit.position.y;
            }
        }

        var i = this.Level.Units.length;
        while (i--) {
            var unit = this.Level.Units[i];
            if (this.ConnectedUnits.indexOf(unit) === -1) {
                var distance = math.Distance(connection.x - unit.position.x, connection.y - unit.position.y);
                var range    = this.Range / this.getDepthDecay(depth);
                if (distance < range) {
                    connection.array.push({
                        array: [],
                        unit:  unit,
                        x:     unit.position.x,
                        y:     unit.position.y,
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
    this.update           = function () {
        this.projectileUpdate();
        this.updateConnections();

        this.graphics.clear();
        this.graphics.lineStyle(this.Width, 0x8888BB, .35);
        this.drawConnection(this.Connection, null);
        this.graphics.lineStyle(this.Width * 2, 0xAAAAFF, .15);
        this.drawConnection(this.Connection, null);
    };

    this.drawConnection = function (connection, parentConnection) {
        var i = connection.array.length;
        while (i--) this.drawConnection(connection.array[i], connection);
        if (parentConnection !== null && !isNaN(connection.x) && !isNaN(connection.y) && !isNaN(parentConnection.x) && !isNaN(parentConnection.y)) {

            var px               = parentConnection.x,
                py               = parentConnection.y,
                x                = parentConnection.x,
                y                = parentConnection.y,
                distance         = math.Distance(connection.x - parentConnection.x, connection.y - parentConnection.y),
                iteration        = 0,
                iterationLimit   = Math.ceil(distance / 15),
                distPerIteration = 1 / iterationLimit;

            this.graphics.moveTo(px - this.position.x, py - this.position.y);

            while (iteration++ < iterationLimit && (x != connection.x || y != connection.y)) {

                var direction = math.angle(x, y, connection.x, connection.y),
                    rand      = Math.PI * .2 * Math.random() - Math.PI * .1,
                    xMove     = distance * distPerIteration * Math.cos(direction + rand),
                    yMove     = distance * distPerIteration * Math.sin(direction + rand);

                x += xMove;
                y += yMove;

                if (iteration === iterationLimit) {
                    x = connection.x;
                    y = connection.y;
                }

                this.graphics.lineTo(x - this.position.x, y - this.position.y);
                px = x;
                py = y;
            }
        }
    }
}

ShockProjectile.prototype             = Object.create(PIXI.Container.prototype);
ShockProjectile.prototype.constructor = ShockProjectile;
