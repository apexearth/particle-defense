describe('Level Tests', function () {
    var Level = require('../src/game/Level');
    var Building = require('../src/game/buildings/Building');
    var Settings = require('../src/game/Settings');
    var expect = require('chai').expect;

    var width = 10;
    var height = 10;
    var level;

    beforeEach(function () {
        level = new Level(width, height);
    });

    it('initialization', function () {
        expect(level.width).to.equal(width * Settings.BlockSize);
        expect(level.height).to.equal(height * Settings.BlockSize);
        expect(level.bounds.left).to.equal(0);
        expect(level.bounds.top).to.equal(0);
        expect(level.bounds.right).to.equal(width * Settings.BlockSize);
        expect(level.bounds.bottom).to.equal(height * Settings.BlockSize);

        expect(level.position.x).to.equal(-width / 2 * Settings.BlockSize);
        expect(level.position.y).to.equal(-height / 2 * Settings.BlockSize);

        expect(level.player).to.equal(null);
        expect(level.players).to.be.an('array');
        expect(level.units).to.be.an('array');
        expect(level.projectiles).to.be.an('array');
        expect(level.buildings).to.be.an('array');
        expect(level.objects).to.be.an('array');

        expect(level.mouse.x).to.equal(0);
        expect(level.mouse.y).to.equal(0);
        expect(level.totalWaves()).to.equal(0);

        expect(level.winConditions).to.be.an('array');
        expect(level.winConditions.length).to.equal(1);

        expect(level.lossConditions).to.be.an('array');
        expect(level.lossConditions.length).to.equal(1);
    });

    it('addBuilding', function () {
        expect(level.buildings.length).to.equal(0);
        expect(level.container.children.length).to.equal(1);

        var building = new Building(level);
        level.addBuilding(building);
        expect(level.buildings.length).to.equal(1);
        expect(level.container.children.length).to.equal(2);
    });
});
