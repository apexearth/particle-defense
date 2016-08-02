var list = module.exports = {};
list.UnitCircle = require("./unit.circle");
list.Array      = function (unitFunction, count) {
    var array = [];
    while (count--) array.push(unitFunction());
    return array;
};
