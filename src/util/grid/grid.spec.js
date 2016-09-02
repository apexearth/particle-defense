var coverage = require('../../../test/check-coverage');
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
    function blockStatusTesting() {
        var grid = new Grid();
        grid.setBlockStatus(0, 0, 2);
        expect(grid.blockStatus(0, 0)).to.equal(2);
        grid.setBlockStatus(0, 0, 3);
        expect(grid.blockStatus(0, 0)).to.equal(3);
        grid.setBlockStatus(0, 0, 'foo');
        expect(grid.blockStatus(0, 0)).to.equal('foo');
    }

    it('.setBlockStatus()', blockStatusTesting);
    it('.blockStatus()', blockStatusTesting);
    it('.getBlockAtPosition()', function () {
        var grid = new Grid();
        var block = grid.getBlockAtPosition({
            x: grid.blockSize * 1,
            y: grid.blockSize * 1
        });
        expect(block.x).to.equal(1);
        expect(block.y).to.equal(1);
    });
    it('.getBlockFromVector()', function () {
        var grid = new Grid();
        var block = grid.getBlockFromVector({
            x: 1,
            y: 1
        });
        expect(block.x).to.equal(1);
        expect(block.y).to.equal(1);

        expect(function () {
            grid.getBlockFromVector();
        }).to.throw();
        expect(function () {
            grid.getBlockFromVector({x: -1, y: 0});
        }).to.throw();
        expect(function () {
            grid.getBlockFromVector({x: -1, y: -1});
        }).to.throw();
        expect(function () {
            grid.getBlockFromVector({x: -1, y: 0});
        }).to.throw();
        expect(function () {
            grid.getBlockFromVector({x: 11, y: 10});
        }).to.throw();
        expect(function () {
            grid.getBlockFromVector({x: 11, y: 11});
        }).to.throw();
        expect(function () {
            grid.getBlockFromVector({x: 10, y: 11});
        }).to.throw();
    });
    it('.getAdjacentBlocks()', function () {
        var grid = new Grid();
        var blocks = grid.getAdjacentBlocks(0, 0, false);
        expect(blocks.length).to.equal(2);
        expect(blocks[0].x).to.equal(0);
        expect(blocks[0].y).to.equal(1);
        expect(blocks[1].x).to.equal(1);
        expect(blocks[1].y).to.equal(0);
        blocks = grid.getAdjacentBlocks(0, 0, true);
        expect(blocks.length).to.equal(3);
        expect(blocks[0].x).to.equal(0);
        expect(blocks[0].y).to.equal(1);
        expect(blocks[1].x).to.equal(1);
        expect(blocks[1].y).to.equal(0);
        expect(blocks[2].x).to.equal(1);
        expect(blocks[2].y).to.equal(1);

        blocks = grid.getAdjacentBlocks(1, 0, false);
        expect(blocks.length).to.equal(3);
        expect(blocks[0].x).to.equal(0);
        expect(blocks[0].y).to.equal(0);
        expect(blocks[1].x).to.equal(1);
        expect(blocks[1].y).to.equal(1);
        expect(blocks[2].x).to.equal(2);
        expect(blocks[2].y).to.equal(0);
        blocks = grid.getAdjacentBlocks(1, 0, true);
        expect(blocks.length).to.equal(5);
        expect(blocks[0].x).to.equal(0);
        expect(blocks[0].y).to.equal(0);
        expect(blocks[1].x).to.equal(0);
        expect(blocks[1].y).to.equal(1);
        expect(blocks[2].x).to.equal(1);
        expect(blocks[2].y).to.equal(1);
        expect(blocks[3].x).to.equal(2);
        expect(blocks[3].y).to.equal(0);
        expect(blocks[4].x).to.equal(2);
        expect(blocks[4].y).to.equal(1);

        blocks = grid.getAdjacentBlocks(10, 10, false);
        expect(blocks.length).to.equal(2);
        expect(blocks[0].x).to.equal(9);
        expect(blocks[0].y).to.equal(10);
        expect(blocks[1].x).to.equal(10);
        expect(blocks[1].y).to.equal(9);
        blocks = grid.getAdjacentBlocks(10, 10, true);
        expect(blocks.length).to.equal(3);
        expect(blocks[0].x).to.equal(9);
        expect(blocks[0].y).to.equal(9);
        expect(blocks[1].x).to.equal(9);
        expect(blocks[1].y).to.equal(10);
        expect(blocks[2].x).to.equal(10);
        expect(blocks[2].y).to.equal(9);

        blocks = grid.getAdjacentBlocks(2, 2, true);
        expect(blocks.length).to.equal(8);
        expect(blocks[0].x).to.equal(1);
        expect(blocks[0].y).to.equal(1);
        expect(blocks[1].x).to.equal(1);
        expect(blocks[1].y).to.equal(2);
        expect(blocks[2].x).to.equal(1);
        expect(blocks[2].y).to.equal(3);
        expect(blocks[3].x).to.equal(2);
        expect(blocks[3].y).to.equal(1);
        expect(blocks[4].x).to.equal(2);
        expect(blocks[4].y).to.equal(3);
        expect(blocks[5].x).to.equal(3);
        expect(blocks[5].y).to.equal(1);
        expect(blocks[6].x).to.equal(3);
        expect(blocks[6].y).to.equal(2);
        expect(blocks[7].x).to.equal(3);
        expect(blocks[7].y).to.equal(3);
    });
    coverage(this, new Grid());
});