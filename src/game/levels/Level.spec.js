var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-spies'));

var ProjectileSpec = require('../projectiles/Projectile.spec');
var UnitSpec = require('../units/Unit.spec');
var BuildingSpec = require('../buildings/Building.spec');

describe('Level', function () {
    var Level = require('./Level');
    var Player = require('../Player');
    var Building = require('../buildings/Building');
    var Settings = require('../Settings');
    var BlockStatus = require('../../util/grid').BlockStatus;
    var coverage = require('../../../test/check-coverage');

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
        expect(addedBuilding.block.building).to.equal(addedBuilding);
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
    it('.addProjectile()', function () {
        ProjectileSpec.createProjectile(level);
    });
    it('.removeProjectile()', function () {
        ProjectileSpec.createProjectile(level);
        ProjectileSpec.createProjectile(level);
        expect(level.projectiles.length).to.equal(2);
        var projectileToRemove = level.projectiles[0];
        var projectileToNotRemove = level.projectiles[1];
        expect(level.removeProjectile(projectileToRemove)).to.equal(projectileToRemove);
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
    it('.isBlockCoordBuildable()', function () {
        var block = level.getBlock(0, 0);
        block.status = BlockStatus.IsEmpty;
        expect(level.isBlockCoordBuildable(block.x, block.y)).to.equal(true);
        block.status = BlockStatus.OnlyPassable;
        expect(level.isBlockCoordBuildable(block.x, block.y)).to.equal(false);
        block.status = BlockStatus.IsEmpty;
        expect(level.isBlockCoordBuildable(block.x, block.y)).to.equal(true);
        block.objects.push({});
        expect(level.isBlockCoordBuildable(block.x, block.y)).to.equal(false);
    });
    it('.hitTest()', function () {
        expect(level.hitTest({x: level.width, y: level.height})).to.equal(true);
        expect(level.hitTest({x: 0, y: 0})).to.equal(true);
        expect(level.hitTest({x: -1, y: 0})).to.equal(false);
        expect(level.hitTest({x: 0, y: -1})).to.equal(false);
        expect(level.hitTest({x: level.width + 1, y: 0})).to.equal(false);
        expect(level.hitTest({x: 0, y: level.height + 1})).to.equal(false);
    });
    it('.getPath()', function () {
        var path = level.getPath(
            level.getBlock(0, 0),
            level.getBlock(5, 3)
        );
        expect(path).to.exist;
        expect(path.length).to.equal(5);
    });
    it('.getPathForUnit()', function () {
        var mockUnit = {
            position: {x: 0, y: 0},
            target: {position: {x: 5 * level.blockSize, y: 3 * level.blockSize}}
        };
        var path = level.getPathForUnit(mockUnit);
        expect(path).to.exist;
        expect(path.length).to.equal(5);
    });
    describe('.processKeyboardInput()', function () {
        it('escape, stop building placement', function () {
            level.inputs.keyboard('<escape>', 1);
            level.placementBuilding = {};
            level.processKeyboardInput();
            expect(level.inputs.keyboard('<escape>')).to.equal(0); // Resets key after processing the input.
            expect(level.placementBuilding).to.equal(null);
        });
    });
    describe('.processMouseInput()', function () {
        it('mouse0, Select Building', function () {
            var building = BuildingSpec.createBuilding(level, level.players[0]);
            level.addBuilding(building);
            level.inputs.mouse('x', 1);
            level.inputs.mouse('y', 1);
            level.inputs.mouse('mouse0', 1);
            level.processMouseInput();
            expect(level.inputs.mouse('mouse0')).to.equal(0); // Resets mouse button after processing the input.
            expect(level.selection).to.equal(building);
            expect(building.selected).to.equal(true);
        });
        it('mouse0, Place Building', function () {
            level.beginBuildingPlacement(Building);
            level.player.resources.energy = Building.cost.energy;
            level.player.resources.metal = Building.cost.metal;
            expect(level.getBlock(0, 0).building).to.equal(null);
            level.inputs.mouse('x', 1);
            level.inputs.mouse('y', 1);
            level.inputs.mouse('mouse0', 1);
            level.processMouseInput();
            expect(level.inputs.mouse('mouse0')).to.equal(0); // Resets mouse button after processing the input.
            expect(level.placementBuilding).to.equal(null);
            expect(level.getBlock(0, 0).building.constructor).to.equal(Building);
        });
        it('mouse2, Cancel Place Building', function () {
            level.beginBuildingPlacement(Building);
            expect(level.getBlock(0, 0).building).to.equal(null);
            level.inputs.mouse('x', 1);
            level.inputs.mouse('y', 1);
            level.inputs.mouse('mouse2', 1);
            level.processMouseInput();
            expect(level.inputs.mouse('mouse2')).to.equal(0); // Resets mouse button after processing the input.
            expect(level.placementBuilding).to.equal(null);
            expect(level.getBlock(0, 0).building).to.equal(null);
        });
    });
    it('.beginBuildingPlacement()', beginBuildingPlacement);
    function beginBuildingPlacement() {
        var building = level.beginBuildingPlacement(Building);
        expect(level.placementBuilding.constructor).to.equal(Building);
        expect(level.placementBuilding).to.equal(building);
        // We'll want it to be visible during placement.
        expect(level.container.children).to.include(building.container);
        // We don't want it to do anything during placement.
        expect(level.buildings).to.not.include(building);
        expect(building.player.buildings).to.not.include(building);
        return building;
    }

    it('.finalizeBuildingPlacement()', function () {
        var placementBuilding = beginBuildingPlacement();
        var block = level.getBlock(0, 1);
        var finalBuilding;
        expect(function () {
            finalBuilding = level.finalizeBuildingPlacement(block);
        }).to.throw();
        level.player.resources.energy = Building.cost.energy;
        level.player.resources.metal = Building.cost.metal;
        finalBuilding = level.finalizeBuildingPlacement(block);
        expect(placementBuilding).to.not.equal(finalBuilding);
        // Building is fully added to the level & player.
        expect(finalBuilding.block).to.equal(block);
        expect(finalBuilding.block.building).to.equal(finalBuilding);
        expect(level.container.children).to.include(finalBuilding.container);
        expect(level.buildings).to.include(finalBuilding);
        expect(finalBuilding.player.buildings).to.include(finalBuilding);
    });
    it('.cancelBuildingPlacement()', function () {
        var placementBuilding = beginBuildingPlacement();
        level.cancelBuildingPlacement();
        expect(level.placementBuilding).to.equal(null);
        expect(level.container.children).to.not.include(placementBuilding.container);
    });
    it('.updatePaths()', function () {
        var unit = UnitSpec.addUnit(level);
        unit.findPath = chai.spy(unit.findPath);
        level.updatePaths();
        expect(unit.findPath).to.have.been.called();
    });
    it('.selectBuildingAt()', selectBuildingAt);
    function selectBuildingAt() {
        var building = BuildingSpec.createBuilding(level, level.players[0]);
        level.addBuilding(building);
        expect(level.selectBuildingAt(level.getBlock(0, 0))).to.equal(building);
        expect(level.selection).to.equal(building);
        expect(building.selected).to.equal(true);
        return building;
    }

    it('.deselect()', function () {
        var building = selectBuildingAt();
        level.deselect();
        expect(level.selection).to.equal(null);
        expect(building.selected).to.equal(false);
    });
    it('.checkWinConditions()', function () {
        level.winConditions = [
            () => true
        ];
        expect(level.checkWinConditions()).to.equal(true);
        level.winConditions = [
            () => true,
            () => false
        ];
        expect(level.checkWinConditions()).to.equal(false);
    });
    it('.checkLossConditions()', function () {
        level.lossConditions = [
            () => true
        ];
        expect(level.checkLossConditions()).to.equal(true);
        level.lossConditions = [
            () => true,
            () => false
        ];
        expect(level.checkLossConditions()).to.equal(false);
    });
    it('.initialize()', function () {
        level.initialize({
            testField: true
        });
    });
    describe('.update()', function () {
        it('.frameCount', function () {
            expect(level.update.bind(level)).to.increase(level, 'frameCount');
        });
        it('.mouse', function () {
            level.mouse = null;
            level.update();
            expect(level.mouse).to.include.keys('x', 'y');
        });
        it('.placementBuilding', function () {
            level.placementBuilding = {position: {}};
            level.update();
            expect(level.placementBuilding.position).to.include.keys('x', 'y');
        });
        it('.processMouseInput()', function () {
            level.processMouseInput = chai.spy(level.processMouseInput);
            level.update();
            expect(level.processMouseInput).to.have.been.called();
        });
        it('.processKeyboardInput()', function () {
            level.processKeyboardInput = chai.spy(level.processKeyboardInput);
            level.update();
            expect(level.processKeyboardInput).to.have.been.called();
        });
        it('.checkCount, check win or loss', function () {
            level.checkWinConditions = chai.spy(level.checkWinConditions);
            level.checkLossConditions = chai.spy(level.checkLossConditions);
            level.update();
            expect(level.checkWinConditions).to.have.not.been.called();
            expect(level.checkLossConditions).to.have.not.been.called();
            level.checkCount = Settings.second;
            level.update();
            expect(level.checkWinConditions).to.have.been.called();
            expect(level.checkLossConditions).to.have.been.called();
        });
        function assureIteratedAndUpdated(key) {
            it('.' + key + ' > .update', function () {
                level[key] = [];
                level[key].push({update: chai.spy()});
                level.update();
                expect(level[key][0].update).to.have.been.called();
            });
        }

        assureIteratedAndUpdated('units');
        assureIteratedAndUpdated('buildings');
        assureIteratedAndUpdated('projectiles');
        assureIteratedAndUpdated('objects');
        assureIteratedAndUpdated('players');
    });

    coverage(this, createLevel());
});
