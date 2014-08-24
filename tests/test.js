describe('RequireJS Setup Tests', function () {
    var jasmine;
    beforeEach(function () {
        runs(function () {
            require(["jasmine"], function (_jasmine) {
                jasmine = _jasmine;
            });
        });
        waitsFor(function () {
            return jasmine;
        }, 300);

    });

    it('should load jasmine', function () {
        expect(jasmine).toBeDefined();
    });
});
