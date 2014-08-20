describe('Level Tests', function () {
    var Settings, Levels, Buildings, Unit;
    beforeEach(function () {
        runs(function () {
            require(["game/Settings", "game/Levels", "../src/game/Buildings", "game/Unit"], function (settings, levels, buildings, unit) {
                Settings = settings;
                Levels = levels;
                Buildings = buildings;
                Unit = unit;
            });
        });
        waitsFor(function () {
            return Settings;
        });
        waitsFor(function () {
            return Levels;
        });
        waitsFor(function () {
            return Buildings;
        });
    });
    it('should have settings', function () {
        expect(Settings).toBeDefined();
    });
    it('should have win conditions and the conditions should be checkable', function () {
        var level = Levels.LevelTest();
        expect(level.WinConditions).toBeDefined();
        expect(level.checkWinConditions()).toBeFalsy();
    });
    it('should release waves of units', function () {
        var level = Levels.LevelTest();
        var homeBase = new Buildings.HomeBase(level, level.Players[0], 5, 5);
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
        var level = Levels.LevelTest();
        var homeBase = level.Player.HomeBase;
        level.Buildings.push(homeBase);
        expect(level.LossConditions).toBeDefined();
        expect(level.checkLossConditions()).toBeFalsy();
        homeBase.Health = 0;
        level.update();
        expect(level.checkLossConditions()).toBeTruthy();
    });

    it('should have the homebase lose health when a unit reaches it', function () {
        var level = Levels.LevelTest();
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
        i = 30;
        while (i--) level.update();
        expect(homeBase.Health).toBe(0);
    });
});
