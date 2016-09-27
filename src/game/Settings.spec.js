describe('Settings', function () {
    var Settings = require('./Settings');
    var coverage = require('../../test/check-coverage');
    var expect = require('chai').expect;
    it('default', function () {
        expect(Settings).to.include.keys([
            'BlockSize'
        ]);
    });

    coverage(this, Settings);
});
