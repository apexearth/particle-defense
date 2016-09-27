describe('units', function () {
    var Levels = require('../levels');
    var Units = require('./');
    var Unit = require('./Unit');
    var expect = require('chai').expect;

    var level;

    function createLevel() {
        level = Levels.list.Test();
    }

    it('Units.Array()', function () {
        createLevel();

        var units = Units.Array(function () {
            return new Unit({
                level: level,
                player: level.players[0],
                position: {x: 0, y: 0}
            });
        }, 10);
        expect(units.length).to.equal(10);
        expect(units[0].constructor).to.equal(Unit);
    });

    it('new: UnitCircle', function () {
        createLevel();

        var unit = new Units.Engineer({
            level: level,
            player: level.players[0],
            position: {x: 0, y: 0}
        });
        expect(unit).to.exist;
    });

});
