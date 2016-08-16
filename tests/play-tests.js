describe('Play Tests', function () {
    var Levels = require("../src/game/Levels");
    var expect = require("chai").expect;

    it('The basic tower should defeat a simple wave and win the game.', function () {
        var level = Levels.LevelTest();
        expect(level.checkLossConditions()).to.not.be.ok;
        expect(level.checkWinConditions()).to.not.be.ok;

        var i = 3000;
        while (i-- || level.Waves.length !== 0 && level.Units.length !== 0) level.update();

        expect(level.checkLossConditions()).to.not.be.ok;
        expect(level.checkWinConditions()).to.be.ok;
    });
});
