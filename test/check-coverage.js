module.exports = function (suite, obj, ignores) {
    if (typeof suite !== 'object') throw new Error('suite is required');
    if (typeof obj === 'undefined') throw new Error('obj cannot be undefined');
    ignores = ignores || [];
    ignores = ignores.concat(Object.getOwnPropertyNames(Object.prototype));
    if (typeof obj === 'function') {
        obj(start);
    } else {
        start(obj);
    }
    function start(object) {
        check(object, Object.getOwnPropertyNames(object.constructor.prototype));
        check(object, Object.keys(object));
    }

    function check(object, keys) {
        for (var key of keys) {
            if (ignores.indexOf(key) >= 0) continue;
            if (typeof object[key] === 'function') {
                if (!hasTest(suite, key)) {
                    it('.' + key + '()', function () {
                        throw new Error('.' + this + '() is not implemented.');
                    }.bind(key));
                }
            }
        }
    }
};

function hasTest(suite, func) {
    var expectedTestName = '.' + func + '()';
    for (var key in suite.suites) {
        if (suite.suites.hasOwnProperty(key)
            && (
                suite.suites[key].title === expectedTestName ||
                hasTest(suite.suites[key], func)
            )) {
            return true;
        }
    }
    for (key in suite.tests) {
        if (suite.tests.hasOwnProperty(key) && suite.tests[key].title === expectedTestName) {
            return true;
        }
    }
    return false;
}