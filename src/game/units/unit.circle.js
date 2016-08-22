var Unit = require('./Unit');

module.exports = CircleUnit;

function CircleUnit(level, templates) {
    Unit.call(this, level, templates);

    this.graphics.clear();
    this.graphics.beginFill(0xFFFFFF, .75);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();
}

CircleUnit.prototype             = Object.create(Unit.prototype);
CircleUnit.prototype.constructor = CircleUnit;
