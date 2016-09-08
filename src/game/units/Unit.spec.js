describe('Unit', function () {
    var levels = require('../levels');
    var math = require('../../util/math');
    var Unit = require('./Unit');
    var coverage = require('../../../test/check-coverage');
    var expect = require('chai').expect;

    module.exports = {
        addUnit: addUnit,
        removeUnit: removeUnit
    };

    var level;
    var unit;

    function createLevel() {
        level = levels.list.Test();
    }

    function addUnit(level) {
        unit = new Unit({
            level: level,
            player: level.players[0],
            position: {
                x: level.width / 4,
                y: level.width / 2
            }
        });
        expect(level.addUnit.bind(level, unit)).to.increase(level.units, 'length');
        return unit;
    }

    function removeUnit(level, unit) {
        expect(level.removeUnit.bind(level, unit)).to.decrease(level.units, 'length');
    }

    it('.move()', function () {
        createLevel();
        addUnit(level);

        unit.setDestination(level.player.buildings[0]);
        expect(unit.path.length).to.be.greaterThan(0);

        var initialDistance = math.distance(unit.position.x - unit.target.position.x, unit.position.y - unit.target.position.y);
        unit.update();
        var distanceAfterUpdate = math.distance(unit.position.x - unit.target.position.x, unit.position.y - unit.target.position.y);
        expect(initialDistance).to.be.above(distanceAfterUpdate);
    });
    it('.damage()', function () {
        createLevel();
        var unit = addUnit(level);

        expect(level.addUnit.bind(level, unit)).to.increase(level.units, 'length');
        expect(unit.damage.bind(unit, 1)).to.decrease(unit, 'health');

        // Damage can cause unit death.
        expect(level.player.score).to.equal(0);
        expect(unit.damage.bind(unit, unit.health)).to.decrease(level.units, 'length');
        expect(level.player.score).to.be.above(0);
    });
    it('.velocity', function () {
        createLevel();
        var unit = addUnit(level);
        unit.position.x = level.buildings[0].position.x - 100;
        unit.position.y = level.buildings[0].position.y - 100;

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
    it('.findPath()', function () {
        var unit = addUnit(level);
        unit.setDestination(level.buildings[0]);
        var path = unit.findPath();
        expect(path).to.be.an('array');
        expect(path.length).to.be.greaterThan(0);
    });
    it('.setDestination()', function () {
        var unit = addUnit(level);
        unit.setDestination(level.buildings[0]);
        expect(unit.path).to.be.an('array');
        expect(unit.path.length).to.be.greaterThan(0);
        expect(unit.target).to.equal(level.buildings[0]);
    });
    it('.clearDestination()', function () {
        var unit = addUnit(level);
        unit.setDestination(level.buildings[0]);
        expect(unit.path).to.be.an('array');
        expect(unit.path.length).to.be.greaterThan(0);
        expect(unit.target).to.equal(level.buildings[0]);

        unit.clearDestination();
        expect(unit.path).to.equal(null);
        expect(unit.target).to.equal(null);
    });
    it('.die()', function () {
        var unit = addUnit(level);
        expect(unit.dead).to.equal(false);
        expect(unit.player.score).to.equal(0);
        unit.die();
        expect(unit.dead).to.equal(true);
        expect(unit.player.score).to.be.greaterThan(0);
        expect(unit.block.contains(unit)).to.equal(false);
        expect(level.containsUnit(unit)).to.equal(false);
    });
    it('.hitTest()', function () {
        createLevel();
        var unit = addUnit(level);
        expect(unit.hitTest(unit.position, 0)).to.equal(true);
        expect(unit.hitTest({x: unit.position.x, y: unit.position.y + unit.radius + 1}, 0)).to.equal(false);
        expect(unit.hitTest({x: unit.position.x + unit.radius + 1, y: unit.position.y}, 0)).to.equal(false);
        expect(unit.hitTest({x: unit.position.x, y: unit.position.y + unit.radius + 1}, 1)).to.equal(true);
        expect(unit.hitTest({x: unit.position.x, y: unit.position.y + unit.radius + 2}, 1)).to.equal(false);
    });
    it('.hitTestLine()', function () {
        createLevel();
        var unit = addUnit(level);
        expect(unit.hitTestLine(
            {x: unit.position.x, y: unit.position.y - 100},
            unit.position
        )).to.equal(true);
        expect(unit.hitTestLine(
            {x: unit.position.x, y: unit.position.y - 100},
            {x: unit.position.x, y: unit.position.y - unit.radius - 1}
        )).to.equal(false);
        expect(unit.hitTestLine(
            {x: unit.position.x - 100, y: unit.position.y},
            {x: unit.position.x - unit.radius - 1, y: unit.position.y}
        )).to.equal(false);
    });
    it('.draw()', function () {
        // TODO: Test drawing?
    });
    describe('.update()', function () {
        it('updateBlockLocation()', function () {
            createLevel();
            var unit = addUnit(level);
            var block = unit.block;
            unit.position.x += level.blockSize;
            unit.update();
            expect(unit.block).to.not.equal(block);
        });
    });

    coverage(this, function (done) {
        createLevel();
        var unit = addUnit(level);
        done(unit);
    });
});
