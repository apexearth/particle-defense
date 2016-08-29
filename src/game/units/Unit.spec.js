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
        return unit;
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
        var unit = addUnit();

        expect(level.addUnit.bind(level, unit)).to.increase(level.units, 'length');
        expect(unit.damage.bind(unit, 1)).to.decrease(unit, 'health');

        // Damage can cause unit death.
        expect(level.player.score).to.equal(0);
        expect(unit.damage.bind(unit, unit.health)).to.decrease(level.units, 'length');
        expect(level.player.score).to.be.above(0);
    });
    it('.velocity', function () {
        createLevel();
        var unit = addUnit();

        unit.clearDestination();
        unit.velocity.x = 10;
        unit.velocity.y = 10;
        unit.update();
        expect(unit.velocity.x).to.equal(0);
        expect(unit.velocity.y).to.equal(0);

        unit.setDestination(level.buildings[0]);
        unit.update();
        expect(unit.velocity.x).to.not.equal(0);
        expect(unit.velocity.y).to.not.equal(0);
    });
});
