var Player = require('../Player');
var Level = require('../levels/').Level;

var buildings = require('./');
var expect = require('chai').expect;

describe('buildings', function () {
    for (var name in buildings) {
        it('instantiation: ' + name, function () {
            var options = {
                level: new Level(),
                player: new Player()
            };
            var building = new buildings[name](options);
            expect(building).to.exist;
        });
    }
});