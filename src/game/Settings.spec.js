describe('Settings', function () {
    var Settings = require('./Settings');
    var expect = require('chai').expect;
    it('default', function () {
        expect(Settings).to.include.keys([
            'BlockSize',
            'second'
        ]);
    });
});
