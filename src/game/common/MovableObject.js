const math = require('../../util/math');
const GameObject = require('./GameObject');

module.exports = MovableObject;

function MovableObject(options) {
    GameObject.call(this, options);


    this.moveSpeed = 10;
    this.moveFriction = .2;

    var velocity = {
        x: 0,
        y: 0
    };
    this.path = [];
    this.moveTarget = null;

    Object.defineProperties(this, {
        velocity: {
            get: function () {
                return velocity;
            }
        }
    });
}
MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.prototype.moveTo = function (position) {
    this.path = this.findPath(position);
    this.moveTarget = position;
};

MovableObject.prototype.clearMove = function () {
    this.path = [];
    this.moveTarget = null;
};

MovableObject.prototype.findPath = function (position) {
    return this.level.getPath(this.position, position);
};

MovableObject.prototype.updatePath = function () {
    if (this.moveTarget) {
        this.path = this.findPath(this.moveTarget);
    } else {
        this.path = [];
    }
};

MovableObject.prototype.update = function (seconds) {
    if (typeof seconds !== 'number') {
        throw new Error('Argument seconds must be provided and must be a number');
    }
    if (this.path.length > 0) {
        if (Math.abs(this.position.x - this.path[0][0]) <= this.level.blockSize / 2 &&
            Math.abs(this.position.y - this.path[0][1]) <= this.level.blockSize / 2) {
            this.path.splice(0, 1);
        }
    }

    if (this.moveTarget) {
        var moveAmount;
        if (this.path.length > 0) {
            moveAmount = math.normalize(this.position.x, this.position.y, this.path[0][0], this.path[0][1]);
        } else if (this.moveTarget) {
            moveAmount = math.normalize(this.position.x, this.position.y, this.moveTarget.x, this.moveTarget.y);
        }
        this.velocity.x += moveAmount.x * this.moveSpeed * seconds;
        this.velocity.y += moveAmount.y * this.moveSpeed * seconds;
    }

    this.position.x += this.velocity.x * seconds;
    this.position.y += this.velocity.y * seconds;

    this.velocity.x -= this.velocity.x * this.moveFriction * seconds;
    this.velocity.y -= this.velocity.y * this.moveFriction * seconds;
};