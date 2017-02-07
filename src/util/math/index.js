const Vector = require('./Vector');
const atan2quick = require('./atan2-quick');
const angles = require('./angles');

module.exports = {
    Vector:          Vector,
    atan2q:          atan2quick.atan2,
    atan2qDeg:       atan2quick.atan2Deg,
    angle:           angles.angle,
    angleDeg:        angles.angleDeg,
    leadingAngle:    angles.leadingAngle,
    leadingAngleDeg: angles.leadingAngleDeg,
    leadingVector:   angles.leadingVector,
    normalize:       function (x1, y1, x2, y2) {
        var dirx = x2 - x1;
        var diry = y2 - y1;
        var hyp  = Math.sqrt(dirx * dirx + diry * diry);
        dirx /= hyp;
        diry /= hyp;
        if (isNaN(dirx)) dirx = 0;
        if (isNaN(diry)) diry = 0;
        return {x: dirx, y: diry};
    },
    distance: function (x, y) {
        return Math.sqrt(Math.abs((x * x) + (y * y)));
    },
    distanceSq: function (x, y) {
        return Math.abs((x * x) + (y * y));
    },
    isNumber:        function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
};
