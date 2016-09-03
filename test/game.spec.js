var expect = require('chai').expect;
var game = require('../src/game');
describe('~Flow', function () {
    beforeEach(function () {
        // Decrease second to cause faster updates.
        expect(game.second).to.be.a('number');
        game.second = 0;
    });

    it('start and stop a game', function (done) {
        var levels = game.levels;
        game.start(levels[0]);
        expect(game.frames).to.equal(0);
        expect(game.running).to.equal(true);
        setTimeout(function () {
            game.stop();
            expect(game.frames).to.be.greaterThan(0);
            expect(game.running).to.equal(false);
            done();
        }, game.second + 1);
    });

    it('expose information for ui', function () {
        var levels = game.levels;
        game.start(levels[0]);
        expect(game.player).to.exist;
    });
});