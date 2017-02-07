const Player = require('../player');
const Level = require('../levels/').Level;

const buildings = require('./');
const expect = require('chai').expect;

describe('buildings', function () {
    for (var name in buildings) {
        it('new: ' + name, function () {
            var options = {
                level: new Level(),
                player: new Player()
            };
            var constructor = buildings[name];
            expect(constructor).to.include.keys([
                'cost',
                'tags'
            ]);
            var building = new constructor(options);
            expect(building).to.exist;
        });
    }
});
