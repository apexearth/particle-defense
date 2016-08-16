describe('Level Tests', function () {
    var Levels = require("../src/game/Levels");
    var Unit = require("../src/game/units/unit");
    var Settings = require("../src/game/Settings");
    var expect = require("chai").expect;
    
    it('should have settings', function () {
        expect(Settings).to.not.be.undefined;
    });
    it('should have win conditions and the conditions should be checkable', function () {
        var level = Levels.LevelTest();
        expect(level.WinConditions).to.not.be.undefined;
        expect(level.checkWinConditions()).to.not.be.ok;
    });
    it('should release waves of units', function () {
        var level = Levels.LevelTest();
        level.Waves = [];
        //level.createWave([new Unit(level)], 1);
        level.WaveDelay = 2;
        level.update();
        expect(level.Waves.length).to.equal(1);
        expect(level.Units.length).to.equal(0);
        level.update();
        level.update();
        expect(level.Waves.length).to.equal(0);
        level.update();
        expect(level.Units.length).to.equal(1);
    });

    it('should have loss conditions and the conditions should be checkable', function () {
        var level = Levels.LevelTest();
        var homeBase = level.Player.HomeBase;
        level.Buildings.push(homeBase);
        expect(level.LossConditions).to.not.be.undefined;
        expect(level.checkLossConditions()).to.not.be.ok;
        homeBase.Health = 0;
        level.update();
        expect(level.checkLossConditions()).to.be.ok;
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
        expect(homeBase.Health).to.equal(1);
        i = 30;
        while (i--) level.update();
        expect(homeBase.Health).to.equal(0);
    });

});
