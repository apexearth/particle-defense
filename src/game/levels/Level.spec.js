var ProjectileSpec = require('../projectiles/Projectile.spec');
var UnitSpec = require('../units/Unit.spec');

describe('Level', function () {
    var Level = require('./Level');
    var Player = require('../Player');
    var Building = require('../buildings/Building');
    var Settings = require('../Settings');
    var BlockStatus = require('../../util/grid').BlockStatus;
    var coverage = require('../../../tests/check-coverage');
    var expect = require('chai').expect;
    var width = 10;
    var height = 10;
    var level;

    function createLevel() {
        return new Level({
            width: width,
            height: height,
            player: new Player()
        });
    }

    beforeEach(function () {
        level = createLevel();
    });

    it('new', function () {
        expect(level.width).to.equal(width * Settings.BlockSize);
        expect(level.height).to.equal(height * Settings.BlockSize);
        expect(level.bounds.left).to.equal(0);
        expect(level.bounds.top).to.equal(0);
        expect(level.bounds.right).to.equal(width * Settings.BlockSize);
        expect(level.bounds.bottom).to.equal(height * Settings.BlockSize);

        expect(level.position.x).to.equal(-width / 2 * Settings.BlockSize);
        expect(level.position.y).to.equal(-height / 2 * Settings.BlockSize);

        expect(level.player).to.exist;
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
    it('.addBuilding()', addBuilding);
    function addBuilding() {
        expect(level.buildings.length).to.equal(0);
        expect(level.container.children.length).to.equal(1);

        var building = new Building({
            level: level,
            player: level.players[0]
        });
        var addedBuilding = level.addBuilding(building);
        expect(addedBuilding).to.equal(building);
        expect(level.buildings.length).to.equal(1);
        expect(level.container.children.length).to.equal(2);
    }

    it('.removeBuilding()', function () {
        addBuilding();
        var building = level.buildings[0];
        var removedBuilding = level.removeBuilding(level.buildings[0]);
        expect(removedBuilding).to.equal(building);
        expect(level.buildings.length).to.equal(0);
        expect(level.container.children.length).to.equal(1);
    });
    it('.addUnit()', function () {
        UnitSpec.addUnit(level);
    });
    it('.removeUnit()', function () {
        var unit = UnitSpec.addUnit(level);
        UnitSpec.removeUnit(level, unit);
    });
    it('.totalWaves()', function () {
        expect(level.totalWaves()).to.equal(0);
        level.spawnPoints.push({waves: [0, 1, 2]});
        expect(level.totalWaves()).to.equal(3);
    });
    it('.addProjectile()', function () {
        level.addProjectile(ProjectileSpec.createProjectile(level));
        expect(level.projectiles.length).to.equal(1);
    });
    it('.removeProjectile()', function () {
        level.addProjectile(ProjectileSpec.createProjectile(level));
        level.addProjectile(ProjectileSpec.createProjectile(level));
        expect(level.projectiles.length).to.equal(2);
        var projectileToRemove = level.projectiles[0];
        var projectileToNotRemove = level.projectiles[1];
        level.removeProjectile(projectileToRemove);
        expect(level.projectiles.length).to.equal(1);
        expect(level.projectiles).to.not.include(projectileToRemove);
        expect(level.projectiles).to.include(projectileToNotRemove);
    });
    it('.containsUnit()', function () {
        var unit = UnitSpec.addUnit(level);
        expect(level.containsUnit(unit)).to.equal(true);
    });
    it('.addPlayer()', function () {
        level.addPlayer(new Player());
        expect(level.players.length).to.equal(2);
    });
    it('.getBlock()', function () {
        var block = level.getBlock(0, 0);
        expect(block.x).to.equal(0);
        expect(block.y).to.equal(0);
        expect(function () {
            level.getBlock(-1, 0);
        }).to.throw();
        expect(function () {
            level.getBlock(-1, -1);
        }).to.throw();
        expect(function () {
            level.getBlock(0, -1);
        }).to.throw();
        expect(function () {
            level.getBlock(11, 10);
        }).to.throw();
        expect(function () {
            level.getBlock(11, 11);
        }).to.throw();
        expect(function () {
            level.getBlock(10, 11);
        }).to.throw();
    });
    it('.getBlockOrNull()', function () {
        var block = level.getBlockOrNull(1, 1);
        expect(block.x).to.equal(1);
        expect(block.y).to.equal(1);

        expect(level.getBlockOrNull(-1, 0)).to.equal(null);
        expect(level.getBlockOrNull(0, -1)).to.equal(null);
        expect(level.getBlockOrNull(0, 11)).to.equal(null);
        expect(level.getBlockOrNull(11, 0)).to.equal(null);
        expect(level.getBlockOrNull(0, 0)).to.not.equal(null);
        expect(level.getBlockOrNull(10, 10)).to.not.equal(null);
    });
    it('.getBlockFromCoords()', function () {
        var block = level.getBlockFromCoords(0, 0);
        expect(block.x).to.equal(0);
        expect(block.y).to.equal(0);
        block = level.getBlockFromCoords(level.blockSize, level.blockSize);
        expect(block.x).to.equal(1);
        expect(block.y).to.equal(1);
    });
    it('.getBlockOrNullFromCoords()', function () {
        var block = level.getBlockOrNullFromCoords(0, 0);
        expect(block.x).to.equal(0);
        expect(block.y).to.equal(0);
        block = level.getBlockOrNullFromCoords(level.blockSize, level.blockSize);
        expect(block.x).to.equal(1);
        expect(block.y).to.equal(1);
        block = level.getBlockOrNullFromCoords(-level.blockSize, -level.blockSize);
        expect(block).to.equal(null);
    });
    it('.isBlockBuildable()', function () {
        var block = level.getBlock(0, 0);
        block.status = BlockStatus.IsEmpty;
        expect(level.isBlockBuildable(block)).to.equal(true);
        block.status = BlockStatus.OnlyPassable;
        expect(level.isBlockBuildable(block)).to.equal(false);
        block.status = BlockStatus.IsEmpty;
        expect(level.isBlockBuildable(block)).to.equal(true);
        block.objects.push({});
        expect(level.isBlockBuildable(block)).to.equal(false);
    });
    it('.hitTest()', function () {
        expect(level.hitTest({x: level.width, y: level.height})).to.equal(true);
        expect(level.hitTest({x: 0, y: 0})).to.equal(true);
        expect(level.hitTest({x: -1, y: 0})).to.equal(false);
        expect(level.hitTest({x: 0, y: -1})).to.equal(false);
        expect(level.hitTest({x: level.width + 1, y: 0})).to.equal(false);
        expect(level.hitTest({x: 0, y: level.height + 1})).to.equal(false);
    });

    coverage(this, createLevel());
});
