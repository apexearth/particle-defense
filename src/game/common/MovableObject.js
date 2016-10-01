var math = require('../../util/math');
var PIXI = require('pixi.js');

module.exports = MovableObject;

function MovableObject(options) {
    if (!options.level) throw new Error('A level is required to create a unit.');
    this.level = options.level;
    this.container = new PIXI.Container();

    this.moveSpeed = 1;
    this.moveFriction = .25;
    var velocity = {
        x: 0,
        y: 0
    };
    this.moveTarget = null;

    Object.defineProperties(this, {
        position: {
            get: function () {
                return this.container.position;
            }.bind(this)
        },
        velocity: {
            get: function () {
                return velocity;
            }
        }
    });
}

MovableObject.prototype.moveTo = function (position) {
    this.path = this.findPath(position);
    this.moveTarget = position;
};

MovableObject.prototype.clearMove = function () {
    this.path = null;
    this.moveTarget = null;
};

MovableObject.prototype.findPath = function (position) {
    return this.level.getPath(this.position, position);
};

MovableObject.prototype.updatePath = function () {
    if (this.moveTarget) {
        this.path = this.findPath(this.moveTarget);
    } else {
        this.path = null;
    }
};

MovableObject.prototype.update = function (seconds) {
    if (typeof seconds !== 'number') {
        throw new Error('Argument seconds must be provided and must be a number');
    }
    if (this.path != null && this.path.length > 0) {
        if (Math.abs(this.position.x - this.path[0].x) < this.level.blockSize / 2 &&
            Math.abs(this.position.y - this.path[0].y) < this.level.blockSize / 2) {
            this.path.splice(0, 1);
        }

        if (this.path.length > 0) {
            var moveTarget = this.path[0];
            var moveAmount = math.normalize(this.position.x, this.position.y, moveTarget.x, moveTarget.y);

            this.velocity.x += moveAmount.x * this.moveSpeed * seconds;
            this.velocity.y += moveAmount.y * this.moveSpeed * seconds;
        }
    }

    this.position.x += this.velocity.x * seconds;
    this.position.y += this.velocity.y * seconds;

    this.velocity.x *= 1 - this.moveFriction * seconds;
    this.velocity.y *= 1 - this.moveFriction * seconds;
};