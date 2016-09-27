var PIXI = require('pixi.js');
var math = require('../../util/math');
var Settings = require('../Settings');
var collision = require('geom-collision');

module.exports = Unit;

function Unit(options) {
    if (!options.level) throw new Error('A level is required to create a unit.');
    if (!options.player) throw new Error('A player is required to create a unit.');
    if (!options.position) throw new Error('A position is required to create a unit.');
    this.container = new PIXI.Container();
    this.level = options.level;
    this.player = options.player;

    Object.defineProperties(this, {
        position: {
            get: function () {
                return this.container.position;
            }.bind(this)
        }
    });
    this.position.x = options.position.x;
    this.position.y = options.position.y;
    this.block = this.level.getBlock((this.position.x / Settings.BlockSize) ^ 0, (this.position.y / Settings.BlockSize) ^ 0);
    this.velocity = {
        x: 0,
        y: 0
    };
    this.radius = 3;
    this.moveSpeed = 1;
    this.health = 10;
    this.target = null;
    this.path = null;
    this.score = this.health * this.moveSpeed;
    this.dead = false;

    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.graphics.beginFill(0xFFFFFF, .75);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();


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
    this.move = function (seconds) {
        if (this.path == null || this.path.length == 0) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            return;
        }
        var moveTarget = this.path[0];
        var moveAmount = math.normalize(this.position.x, this.position.y, moveTarget.x, moveTarget.y);

        this.velocity.x += moveAmount.x * this.moveSpeed * seconds;
        this.velocity.y += moveAmount.y * this.moveSpeed * seconds;

        var finalMoveAmount = {
            x: this.velocity.x * seconds,
            y: this.velocity.x * seconds
        };
        if (Math.abs(this.position.x - moveTarget.x) > Math.abs(finalMoveAmount.x))
            this.position.x += finalMoveAmount.x;
        else
            this.position.x = moveTarget.x;

        if (Math.abs(this.position.y - moveTarget.y) > Math.abs(finalMoveAmount.y))
            this.position.y += finalMoveAmount.y;
        else
            this.position.y = moveTarget.y;

        if (this.position.x == moveTarget.x && this.position.y == moveTarget.y)
            this.path.splice(0, 1);
    };
    this.damage = function (amount) {
        this.health -= amount;
        if (this.health <= 0) this.die();
    };
    this.update = function (seconds) {
        if (typeof seconds !== 'number') {
            throw new Error('Argument seconds must be provided and must be a number');
        }
        if (this.score === 0) this.calculateScore();

        this.move();
        updateBlockLocation();

        // Check if reached the target
        if (this.target != null
            && this.position.x === this.target.position.x
            && this.position.y === this.target.position.y) {
            this.target.health--;
            this.die();
        }
    };
    this.die = function () {
        this.dead = true;
        this.level.player.score += this.score;
        this.level.getBlock(this.block.x, this.block.y).remove(this);
        this.level.removeUnit(this);
    };
    this.draw = function (context) {
        context.strokeStyle = '#fff';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
    };
    this.setDestination = function (target) {
        this.target = target;
        this.path = this.findPath();
    };
    this.clearDestination = function () {
        this.target = null;
        this.path = null;
    };
    this.findPath = function () {
        if (!this.target) return null;
        return this.level.getPathForUnit(this);
    };
}

Unit.buildTime = 100;
Unit.cost = {
    energy: 0,
    metal: 0
};