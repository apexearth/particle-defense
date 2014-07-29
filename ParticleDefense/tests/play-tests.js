/// <reference path="~/js/jasmine.js"/>
/// <reference path="~/Game/Levels/LevelOne.js"/>
/// <reference path="~/util/Keyboard.js"/>
describe('Play Tests', function () {
    it('The basic tower should defeat a simple wave and win the game.', function () {
        var level = Level.LevelOne();
        expect(level.checkLossConditions()).toBeFalsy();
        expect(level.checkWinConditions()).toBeFalsy();

        var i = 800;
        while (i--) level.update();

        expect(level.checkLossConditions()).toBeFalsy();
        expect(level.checkWinConditions()).toBeTruthy();
    });
});
