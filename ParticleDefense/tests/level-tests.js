/// <reference path="~/js/jasmine.js" />
/// <reference path="~/Game/Levels/LevelOne.js"/>
/// <reference path="~/Game/Level.js"/>
/// <reference path="~/util/Keyboard.js"/>
describe('Level Tests', function () {
    it('should have win conditions and the conditions should be checkable', function () {
        var level = Level.LevelOne();
        expect(level.WinConditions).toBeDefined();
        expect(level.checkWinConditions()).toBeFalsy();
    });
    it('should release waves of units', function () {
        var level = Level.LevelOne();
        var homeBase = new HomeBase(level, level.Players[0], 5, 5);
        level.Buildings.push(homeBase);
        level.Waves = [];
        level.createWave([new Unit(level)], 1);
        level.WaveDelay = 2;
        level.update();
        expect(level.Waves.length).toBe(1);
        expect(level.Units.length).toBe(0);
        level.update();
        level.update();
        expect(level.Waves.length).toBe(0);
        level.update();
        expect(level.Units.length).toBe(1);
    });

    it('should have loss conditions and the conditions should be checkable', function () {
        var level = Level.LevelOne();
        var homeBase = level.Player.HomeBase;
        level.Buildings.push(homeBase);
        expect(level.LossConditions).toBeDefined();
        expect(level.checkLossConditions()).toBeFalsy();
        homeBase.Health = 0;
        level.update();
        expect(level.checkLossConditions()).toBeTruthy();
    });

    it('should have the homebase lose health when a unit reaches it', function () {
        var level = Level.LevelOne();
        var homeBase = level.Player.HomeBase;
        homeBase.Health = 1;
        var unit = new Unit(level);
        level.Units.push(unit);
        unit.X = homeBase.X;
        unit.Y = homeBase.Y + 50;
        unit.setDestination(homeBase);
        var i = 10;
        while (i--) level.update();
        expect(homeBase.Health).toBe(1);
        i = 16;
        while (i--) level.update();
        expect(homeBase.Health).toBe(0);
    });
});
