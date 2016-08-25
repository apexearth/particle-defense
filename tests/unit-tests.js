describe('Unit Tests', function () {
    var Levels = require('../src/game/Levels');
    var math = require('../src/util/math');
    var Units = require('../src/game/units');
    var Unit = require('../src/game/units/Unit');
    var expect = require('chai').expect;

    it('should move towards the target move location', function () {
        var level = Levels.LevelTest();
        var unit = new Unit();
        level.addUnit(unit);
        unit.setDestination(level.player.homeBase);

        var i = 5;
        while (i--) {
            var initialDistance = math.distance(unit.x - unit.destination.x, unit.y - unit.destination.y);
            level.update();
            var distanceAfterUpdate = math.distance(unit.x - unit.destination.x, unit.y - unit.destination.y);
            expect(initialDistance).to.be.above(distanceAfterUpdate);
        }
    });
    it('should be able to take damage', function () {
        var level = Levels.LevelTest();
        var unit = new Unit();
        level.addUnit(unit);
        unit.setDestination(level.player.homeBase);

        var initialHealth = unit.health;
        unit.damage(1);
        expect(initialHealth).to.be.above(unit.health);
    });
    it('should die when it runs out of health, and be removed from the level', function () {
        var level = Levels.LevelTest();
        var unit = new Unit();
        level.addUnit(unit);
        unit.setDestination(level.player.homeBase);
        unit.damage(unit.health);
        level.update();
        expect(level.units.indexOf(unit)).to.equal(-1);
    });
    it('should die when it runs out of health, and be removed from the level', function () {
        var level = Levels.LevelTest();
        var unit = new Unit();
        level.addUnit(unit);
        unit.setDestination(level.player.homeBase);
        level.units.push(unit);
        level.player.buildings = [];
        expect(level.player.score).to.equal(0);
        unit.damage(unit.health);
        expect(level.player.score).to.be.above(0);
    });
    it('should have a helper function to deliver an array of units', function () {
        var units = Units.Array(function () {
            return new Unit({x: 10, y: 10});
        }, 10);
        expect(units.length).to.equal(10);
        expect(units[0].constructor).to.equal(Unit);
    });
    it('should have no velocity when it is not moving', function () {
        var level = Levels.LevelTest();
        level.buildings = [];
        level.player.buildings = [];
        var unit = new Unit(level);
        unit.velocity.x = 10;
        unit.velocity.y = 10;
        unit.update();

        expect(unit.velocity.x).to.equal(0);
        expect(unit.velocity.y).to.equal(0);
    });
});
