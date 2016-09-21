var LevelSpec = require('./levels/Level.spec');
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
    after(function () {
        game.initialize();
    });

    it('.initialize()', function () {
        expect(game).to.exist;
    });
    it('.start()', start);
    function start() {
        game.start(game.levels[0]);
        expect(game.timeoutId).to.exist;
        expect(game.player).to.exist;
    }
    it('.startLevel()', function () {
        var levelFn = chai.spy(game.levels[0]);
        expect(game.level).to.not.exist;
        game.startLevel(levelFn);
        expect(game.level).to.exist;
        expect(levelFn).to.have.been.called();
    });
    it('.stop()', stop);
    function stop(done) {
        start();
        expect(game.frames).to.equal(0);
        expect(game.running).to.equal(true);
        setTimeout(function () {
            game.stop();
            expect(game.frames).to.be.greaterThan(0);
            expect(game.running).to.equal(false);
            done();
        }, game.second + 1);
    }

    it('.fastForward()', function () {
        start();
        expect(game.frames).to.equal(0);
        game.fastForward(3);
        expect(game.frames).to.equal(3);
    });
    it('.queueUpdate()', queueUpdate);
    function queueUpdate(done) {
        game.startLevel(game.levels[0]);
        game.update = spy(game.update);
        game.queueUpdate();
        expect(game.update).to.not.have.been.called();
        expect(game.running).to.equal(true);
        setTimeout(function () {
            expect(game.update).to.have.been.called();
            expect(game.running).to.equal(true);
            done();
        }, game.second + 1);
    }

    it('.unqueueUpdate()', function (done) {
        queueUpdate(function () {
            game.update.__spy.called = false;
            game.unqueueUpdate();
            expect(game.running).to.equal(false);
            setTimeout(function () {
                expect(game.update).to.have.not.been.called();
                expect(game.running).to.equal(false);
                done();
            }, game.second + 1);
        });
    });
    it('.update()', function () {
        game.startLevel(game.levels[0]);
        game.level.update = spy(game.level.update);
        expect(game.frames).to.equal(0);
        game.update();
        expect(game.frames).to.equal(1);
        expect(game.level.update).to.have.been.called();
    });
    it('.startBuildingPlacement()', function () {
        start();
        game.level.startBuildingPlacement = spy(game.level.startBuildingPlacement);
        LevelSpec.startBuildingPlacement.call(game, game.buildings[0]);
        expect(game.level.startBuildingPlacement).to.have.been.called();
    });
    it('.finishBuildingPlacement()', function () {
        start();
        var placementBuilding = LevelSpec.startBuildingPlacement.call(game, game.buildings[0]);
        game.level.finishBuildingPlacement = spy(game.level.finishBuildingPlacement);
        LevelSpec.finishBuildingPlacement.call(game, placementBuilding);
        expect(game.level.finishBuildingPlacement).to.have.been.called();
    });
    it('.cancelBuildingPlacement()', function () {
        start();
        LevelSpec.startBuildingPlacement.call(game, game.buildings[0]);
        game.level.cancelBuildingPlacement = spy(game.level.cancelBuildingPlacement);
        LevelSpec.cancelBuildingPlacement.call(game);
        expect(game.level.cancelBuildingPlacement).to.have.been.called();
    });
    it('.moveMouseToCoordinate()', function () {
        game.renderer.resetPosition();
        start();
        game.moveMouseToCoordinate(10, 20);
        expect(game.inputs.mouse('x')).to.equal(-440);
        expect(game.inputs.mouse('y')).to.equal(-430);
    });
    it('.moveMouseToBlock()', function () {
        game.renderer.resetPosition();
        start();
        game.moveMouseToBlock({
            x: 1,
            y: 2
        });
        expect(game.inputs.mouse('x')).to.equal(-410);
        expect(game.inputs.mouse('y')).to.equal(-370);
    });

    coverage(this, game);
});