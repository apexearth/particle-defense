var Player = require('../player');
var Building = require('../buildings/Building');
var Level = require('../levels/').Level;

var weapons = require('./');
var expect = require('chai').expect;

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
