define(["./unit.circle"], function (UnitCircle) {

    var list = {};
    list.UnitCircle = UnitCircle;
    list.Array = function (unitFunction, count) {
        var array = [];
        while (count--) array.push(unitFunction());
        return array;
    };
    return list;

});