define(["./unit"], function (Unit) {

    var list = {};
    list.Unit = Unit;
    list.Array = function (unitFunction, count) {
        var array = [];
        while (count--) array.push(unitFunction());
        return array;
    };
    return list;

});