var Unit = require('./Unit');

module.exports = Engineer;

function Engineer(options) {
    Unit.call(this, options);

    this.graphics.clear();
    this.graphics.beginFill(0xFFFFFF, .75);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();
}

Engineer.prototype = Object.create(Unit.prototype);
Engineer.prototype.constructor = Engineer;

Engineer.buildTime = 10;
Engineer.cost = {
    energy: 0,
    metal: 0
};