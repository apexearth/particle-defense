var PIXI = require('pixi.js');
var math = require('../../util/math');
var Settings = require('../Settings');

module.exports = Unit;

function Unit(options) {
    PIXI.Container.call(this);
    if (!options.level) throw new Error('A level is required to create a unit.');
    if (!options.player) throw new Error('A player is required to create a unit.');
    if (!options.position) throw new Error('A position is required to create a unit.');
    this.level = options.level;
    this.player = options.player;

    this.block = this.level.getBlock((options.position.x / Settings.BlockSize) ^ 0, (options.position.y / Settings.BlockSize) ^ 0);
    this.position.x = options.position.x;
    this.position.y = options.position.y;
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
    this.addChild(this.graphics);
    this.graphics.beginFill(0xFFFFFF, .75);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();


    this.updateBlockLocation = function () {
        var blockX = Math.floor(this.position.x / Settings.BlockSize);
        var blockY = Math.floor(this.position.y / Settings.BlockSize);
        if (!this.block || this.block.x !== blockX || this.block.y !== blockY) {
            if (this.block) {
                this.block.remove(this);
            } else {
                this.block = this.level.getBlock(blockX, blockY);
                this.block.add(this);
            }
        }
    };

    this.hitTest = function (point, radius) {
        return math.distance(this.position.x - point.x, this.position.y - point.y) < this.radius + radius;
    };
    this.hitTestLine = function (start, finish, width) {
        if (width === undefined) width = 1;
        var area2 = Math.abs((finish.x - start.x) * (this.position.y - start.y) - (this.position.x - start.x) * (finish.y - start.y));
        var lab = Math.sqrt(Math.pow(finish.x - start.x, 2) + Math.pow(finish.y - start.y, 2));
        var h = area2 / lab;
        return h < this.radius
            && this.position.x >= Math.min(start.x, finish.x) - this.radius - width && this.position.x <= Math.max(start.x, finish.x) + this.radius + width
            && this.position.y >= Math.min(start.y, finish.y) - this.radius - width && this.position.y <= Math.max(start.y, finish.y) + this.radius + width;
    };
    this.move = function () {
        if (this.path == null || this.path.length == 0) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            return;
        }
        var moveTarget = this.path[0];
        var moveAmount = math.normalize(this.position.x, this.position.y, moveTarget.x, moveTarget.y);
        moveAmount.x *= this.moveSpeed;
        moveAmount.y *= this.moveSpeed;

        this.velocity.x = moveAmount.x;
        this.velocity.y = moveAmount.y;

        if (Math.abs(this.position.x - moveTarget.x) > Math.abs(moveAmount.x))
            this.position.x += moveAmount.x;
        else
            this.position.x = moveTarget.x;

        if (Math.abs(this.position.y - moveTarget.y) > Math.abs(moveAmount.y))
            this.position.y += moveAmount.y;
        else
            this.position.y = moveTarget.y;

        if (this.position.x == moveTarget.x && this.position.y == moveTarget.y)
            this.path.splice(0, 1);

    };
    this.damage = function (amount) {
        this.health -= amount;
        if (this.health <= 0) this.die();
    };
    this.update = function () {
        if (this.score === 0) this.calculateScore();

        this.move();
        this.updateBlockLocation();

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
        return this.level.getPathForUnit(this);
    };
}

Unit.prototype = Object.create(PIXI.Container.prototype);
Unit.prototype.constructor = Unit;
