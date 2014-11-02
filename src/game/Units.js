define("game/Units", [], function () {

    var list = {};

    list.Array = function (unitFunction, count) {
        var array = [];
        while (count--) array.push(unitFunction());
        return array;
    };

    list.UnitCircle = {
        getCanvas: function () {
            var canvas = document.createElement("canvas");
            canvas.width = 50;
            canvas.height = 50;
            var context = canvas.getContext("2d");
            context.strokeStyle = '#fff';
            context.fillStyle = '#fff';
            context.lineWidth = 2;
            context.beginPath();
            context.arc(25, 25, 24, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();
            context.fill();
            return canvas;
        }
    };

    return list;

});