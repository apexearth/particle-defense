module.exports = function (suite, obj) {
    if (typeof suite !== 'object') throw new Error('suite is required');
    if (typeof obj === 'undefined') throw new Error('obj cannot be undefined');
    if (typeof obj === 'function') {
        obj(check);
    } else {
        check(obj);
    }
    function check(object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)
                && typeof object[key] === 'function') {
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