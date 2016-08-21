describe('Level Tests', function () {
    var Levels = require('../src/game/Levels');
    var Unit = require('../src/game/units/unit');
    var Settings = require('../src/game/Settings');
    var expect = require('chai').expect;
    
    it('should have settings', function () {
        expect(Settings).to.not.be.undefined;
    });
    it('should have win conditions and the conditions should be checkable', function () {
        var level = Levels.LevelTest();
        expect(level.winConditions).to.not.be.undefined;
        expect(level.checkWinConditions()).to.not.be.ok;
    });
    it('should release waves of units', function () {
        var level = Levels.LevelTest();
        level.waves = [];
        //level.createWave([new Unit(level)], 1);
        level.WaveDelay = 2;
        level.update();
        expect(level.waves.length).to.equal(1);
        expect(level.units.length).to.equal(0);
        level.update();
        level.update();
        expect(level.waves.length).to.equal(0);
        level.update();
        expect(level.units.length).to.equal(1);
    });

    it('should have loss conditions and the conditions should be checkable', function () {
        var level = Levels.LevelTest();
        var homeBase = level.player.homeBase;
        level.buildings.push(homeBase);
        expect(level.lossConditions).to.not.be.undefined;
        expect(level.checkLossConditions()).to.not.be.ok;
        homeBase.health = 0;
        level.update();
        expect(level.checkLossConditions()).to.be.ok;
    });

    it('should have the homebase lose health when a unit reaches it', function () {
        var level = Levels.LevelTest();
        var homeBase = level.player.homeBase;
        homeBase.health = 1;
        var unit = new Unit(level);
        level.units.push(unit);
        unit.X = homeBase.X;
        unit.Y = homeBase.Y + 50;
        unit.setDestination(homeBase);
        var i = 10;
        while (i--) level.update();
        expect(homeBase.health).to.equal(1);
        i = 30;
        while (i--) level.update();
        expect(homeBase.health).to.equal(0);
    });

});
