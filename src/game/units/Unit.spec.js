describe('Unit', function () {
    var Levels = require('../levels');
    var math = require('../../util/math');
    var Unit = require('./Unit');
    var expect = require('chai').expect;

    var level;
    var unit;

    function createLevel() {
        level = Levels.LevelTest();
    }
    function addUnit() {
        unit = new Unit({
            level: level,
            player: level.players[0],
            position: {
                x: level.player.homeBase.position.x - 100,
                y: level.player.homeBase.position.y
            }
        });
        expect(level.addUnit.bind(level, unit)).to.increase(level.units, 'length');
    }

    it('.move()', function () {
        createLevel();
        addUnit();

        unit.setDestination(level.player.homeBase);
        expect(unit.path.length).to.be.greaterThan(0);

        var initialDistance = math.distance(unit.position.x - unit.target.position.x, unit.position.y - unit.target.position.y);
        unit.update();
        var distanceAfterUpdate = math.distance(unit.position.x - unit.target.position.x, unit.position.y - unit.target.position.y);
        expect(initialDistance).to.be.above(distanceAfterUpdate);
    });
    it('.damage()', function () {
        createLevel();
        addUnit();

        expect(level.addUnit.bind(level, unit)).to.increase(level.units, 'length');
        expect(unit.damage.bind(unit, 1)).to.decrease(unit, 'health');
        expect(unit.damage.bind(unit, unit.health)).to.decrease(level.units, 'length');
    });
    it('should increase player score when dying', function () {
        createLevel();
        addUnit();

        level.addUnit(unit);
        unit.setDestination(level.player.homeBase);
        level.units.push(unit);
        level.player.buildings = [];
        expect(level.player.score).to.equal(0);
        unit.damage(unit.health);
        expect(level.player.score).to.be.above(0);
    });
    it('should have no velocity when it is not moving', function () {
        createLevel();
        addUnit();

        unit.velocity.x = 10;
        unit.velocity.y = 10;
        unit.update();

        expect(unit.velocity.x).to.equal(0);
        expect(unit.velocity.y).to.equal(0);
    });
});
