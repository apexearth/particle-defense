define("game/Units", [
    "game/Unit"
], function (Unit) {

    var list = {};

    list.Array = function (unitFunction, count) {
        var array = [];
        while (count--) array.push(unitFunction());
        return array;
    };

    list.UnitCircle = function (level, x, y) {
        Unit.call(this, level, x, y);
        this.StrokeColor = '#fff';
        this.FillColor = '#fff';

        this.draw = function (context) {
            context.strokeStyle = this.StrokeColor;
            context.fillStyle = this.FillColor;
            context.lineWidth = 2;
            context.beginPath();
            context.arc(this.X, this.Y, this.Radius, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();
            context.fill();
        };
    };


    return list;

});