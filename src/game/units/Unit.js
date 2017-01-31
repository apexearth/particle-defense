var PIXI = require('pixi.js');
var math = require('../../util/math');
var Settings = require('../Settings');
var collision = require('geom-collision');
var MovableObject = require('../common').MovableObject;

module.exports = Unit;

function Unit(options) {
    MovableObject.call(this, options);
    if (!options.player) throw new Error('A player is required to create a unit.');
    if (!options.position) throw new Error('A position is required to create a unit.');
    this.selectionGraphics = new PIXI.Graphics();
    this.player = options.player;

    var selected = false;
    Object.defineProperties(this, {
        selected: {
            get: function () {
                return selected;
            }.bind(this),
            set: function (value) {
                if (value) {
                    this.container.addChild(this.selectionGraphics);
                } else {
                    this.container.removeChild(this.selectionGraphics);
                }
                selected = value;
            }.bind(this)
        },
    });
    this.position.x = options.position.x;
    this.position.y = options.position.y;
    this.block = this.level.getBlock((this.position.x / Settings.BlockSize) ^ 0, (this.position.y / Settings.BlockSize) ^ 0);
    this.radius = 3;
    this.moveSpeed = 10;
    this.health = 10;
    this.target = null;
    this.score = this.health * this.moveSpeed;
    this.dead = false;

    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.graphics.beginFill(this.player.color, .75);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();

    this.selectionGraphics.lineStyle(2, 0x77FF77, .25);
    this.selectionGraphics.drawCircle(0, 0, this.radius + 1);

    var updateBlockLocation = function () {
        var blockX = Math.floor(this.position.x / Settings.BlockSize);
        var blockY = Math.floor(this.position.y / Settings.BlockSize);
        if (!this.block || this.block.x !== blockX || this.block.y !== blockY) {
            if (this.block) {
                this.block.remove(this);
            }
            this.block = this.level.getBlock(blockX, blockY);
            this.block.add(this);
        }
    }.bind(this);

    this.hitTest = function (point, radius) {
        if (!point || typeof point.x !== 'number' || typeof point.y !== 'number')
            throw new Error('A point is required and must contain x and y.');
        if (typeof radius !== 'number')
            throw new Error('A radius is required and must be a number.');
        return math.distance(this.position.x - point.x, this.position.y - point.y) <= this.radius + radius;
    };
    this.hitTestLine = function (start, finish) {
        if (!start || typeof start.x !== 'number' || typeof start.y !== 'number')
            throw new Error('A start is required and must contain x and y.');
        if (!finish || typeof finish.x !== 'number' || typeof finish.y !== 'number')
            throw new Error('A finish is required and must contain x and y.');
        return collision.lineCircle(start, finish, this.position, this.radius).result === collision.INTERSECT;
    };
    this.damage = function (amount) {
        this.health -= amount;
        if (this.health <= 0) this.die();
    };
    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        MovableObject.prototype.update.call(this, seconds);

        updateBlockLocation();
    };
    this.die = function () {
        this.dead = true;
        this.level.player.score += this.score;
        this.level.getBlock(this.block.x, this.block.y).remove(this);
        this.level.removeUnit(this);
    };
}
Unit.prototype = Object.create(MovableObject.prototype);
Unit.prototype.constructor = Unit;


Unit.buildTime = 100;
Unit.cost = {
    energy: 0,
    metal: 0
};