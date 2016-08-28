describe('Play Tests', function () {
    var Levels = require('../src/game/levels');
    var expect = require('chai').expect;

    it('The basic tower should defeat a simple wave and win the game.', function () {
        var level = Levels.LevelTest();
        expect(level.checkLossConditions()).to.equal(false);
        expect(level.checkWinConditions()).to.equal(false);

        var i = 3000;
        while (i-- || level.totalWaves() !== 0 && level.units.length !== 0) level.update();

        expect(level.checkLossConditions()).to.equal(false);
        expect(level.checkWinConditions()).to.equal(true);
    });
});
