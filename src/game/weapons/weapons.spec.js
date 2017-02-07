const Player = require('../player');
const Building = require('../buildings/Building');
const Level = require('../levels/').Level;

const weapons = require('./');
const expect = require('chai').expect;

describe('weapons', function () {
    for (var name in weapons) {
        it('instantiation: ' + name, function () {
            var options = {
                level: new Level(),
                player: new Player()
            };
            var building = new Building(options);
            var weapon = new weapons[name](Object.assign({
                building: building
            }, options));

            expect(weapon).to.exist;
        });
    }
});
