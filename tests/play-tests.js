﻿describe('Play Tests', function () {
    var Levels;
    beforeEach(function () {
        runs(function () {
            require(["game/Levels"], function (levels) {
                Levels = levels;
            });
        });
        waitsFor(function () {
            return Levels;
        }, 300);
    });
    it('The basic tower should defeat a simple wave and win the game.', function () {
        var level = Levels.LevelTest();
        expect(level.checkLossConditions()).toBeFalsy();
        expect(level.checkWinConditions()).toBeFalsy();

        var i = 3000;
        while (i-- || level.Waves.length !== 0 && level.Units.length !== 0) level.update();

        expect(level.checkLossConditions()).toBeFalsy();
        expect(level.checkWinConditions()).toBeTruthy();
    });
});
