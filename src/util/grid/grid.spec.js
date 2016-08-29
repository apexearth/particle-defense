var expect = require('chai').expect;
var Grid = require('./');

describe('Grid', function () {
    it('new', function () {
        var options = {
            bounds: {
                left: 0,
                top: 0,
                right: 10,
                bottom: 10
            },
            blockSize: 10
        };
        var grid = new Grid(options);
        expect(grid.bounds).to.not.equal(options.bounds);
        expect(grid.bounds.left).to.equal(0);
        expect(grid.bounds.top).to.equal(0);
        expect(grid.bounds.right).to.equal(10);
        expect(grid.bounds.bottom).to.equal(10);
        expect(grid.blockSize).to.equal(options.blockSize);
        expect(grid.getBlock.bind(grid, -1, -1)).to.throw();
        expect(grid.getBlock.bind(grid, 0, -1)).to.throw();
        expect(grid.getBlock.bind(grid, -1, 0)).to.throw();
        expect(grid.getBlock.bind(grid, 11, 11)).to.throw();
        expect(grid.getBlock.bind(grid, 11, 10)).to.throw();
        expect(grid.getBlock.bind(grid, 10, 11)).to.throw();
        expect(grid.getBlock(10, 10)).to.exist;

        expect(grid.getBlockFromVector.bind(grid, {x: 0, y: 0})).to.exist;

        expect(grid.getBlockOrNull(-1, -1)).to.not.exist;
        expect(grid.getBlockOrNull(0, -1)).to.not.exist;
        expect(grid.getBlockOrNull(-1, 0)).to.not.exist;
        expect(grid.getBlockOrNull(11, 11)).to.not.exist;
        expect(grid.getBlockOrNull(11, 10)).to.not.exist;
        expect(grid.getBlockOrNull(10, 11)).to.not.exist;

        expect(grid.getAdjacentBlocks(0, 0, false).length).to.equal(2);
        expect(grid.getAdjacentBlocks(0, 0, true).length).to.equal(3);
        expect(grid.getAdjacentBlocks(1, 0, false).length).to.equal(3);
        expect(grid.getAdjacentBlocks(1, 0, true).length).to.equal(5);
        expect(grid.getAdjacentBlocks(10, 10, false).length).to.equal(2);
        expect(grid.getAdjacentBlocks(10, 10, true).length).to.equal(3);
        expect(grid.getAdjacentBlocks(9, 10, false).length).to.equal(3);
        expect(grid.getAdjacentBlocks(9, 10, true).length).to.equal(5);

        expect(grid.blockStatus(0, 0)).to.equal(Grid.BlockStatus.IsEmpty);
        grid.setBlockStatus(0, 0, 'test');
        expect(grid.blockStatus(0, 0)).to.equal('test');
    });
    it('.getBlock()', function () {
        var grid = new Grid({
            bounds: {
                left: 0,
                top: 0,
                right: 10,
                bottom: 10
            }
        });
        var block = grid.getBlock(1, 1);
        expect(block.x).to.equal(1);
        expect(block.y).to.equal(1);

        expect(function () {
            grid.getBlock(-1, 0);
        }).to.throw();
        expect(function () {
            grid.getBlock(-1, -1);
        }).to.throw();
        expect(function () {
            grid.getBlock(0, -1);
        }).to.throw();
        expect(function () {
            grid.getBlock(11, 10);
        }).to.throw();
        expect(function () {
            grid.getBlock(11, 11);
        }).to.throw();
        expect(function () {
            grid.getBlock(10, 11);
        }).to.throw();
    });
    it('.getBlockOrNull()', function () {
        var grid = new Grid({
            bounds: {
                left: 0,
                top: 0,
                right: 10,
                bottom: 10
            }
        });
        var block = grid.getBlockOrNull(1, 1);
        expect(block.x).to.equal(1);
        expect(block.y).to.equal(1);

        expect(grid.getBlockOrNull(-1, 0)).to.equal(null);
        expect(grid.getBlockOrNull(0, -1)).to.equal(null);
        expect(grid.getBlockOrNull(0, 11)).to.equal(null);
        expect(grid.getBlockOrNull(11, 0)).to.equal(null);
        expect(grid.getBlockOrNull(0, 0)).to.not.equal(null);
        expect(grid.getBlockOrNull(10, 10)).to.not.equal(null);
    });
});