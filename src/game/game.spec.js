var coverage = require('../../test/check-coverage');
var chai = require('chai');
chai.use(require('chai-spies'));
var expect = chai.expect;
var spy = chai.spy;
var game = require('./game');

describe('game', function () {
    beforeEach(function () {
        // Decrease second to cause faster updates.
        expect(game.second).to.be.a('number');
        game.second = 0;
        game.initialize();
    });
    it('.initialize()', function () {
        expect(game).to.exist;
    });

    it('.start()', start);
    function start() {
        var levels = game.levels;
        game.start(levels[0]);
        expect(game.player).to.exist;
    }

    it('.stop()', stop);
    function stop(done) {
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
    }

    it('.queueUpdate()', function (done) {
        game.update = spy(game.update);
        game.queueUpdate();
        expect(game.update).to.not.have.been.called();
        expect(game.running).to.equal(false);
        setTimeout(function () {
            expect(game.update).to.have.been.called();
            expect(game.running).to.equal(false);
            done();
        }, game.second + 1);
    });
    it('.update()', function () {
        game.level.update = spy(game.level.update);
        expect(game.frames).to.equal(0);
        game.update();
        expect(game.frames).to.equal(0);
        expect(game.level.update).to.have.not.been.called();

        game.running = true;
        game.update();
        expect(game.frames).to.equal(1);
        expect(game.level.update).to.have.been.called();
    });

    coverage(this, game);
});