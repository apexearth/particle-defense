const list = module.exports = {};
list.Engineer = require('./Engineer');
list.Array      = function (unitFunction, count) {
    var array = [];
    while (count--) array.push(unitFunction());
    return array;
};
