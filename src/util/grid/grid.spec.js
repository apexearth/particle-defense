var expect = require('chai').expect;
var Grid = require('./');

describe('grid', function () {
    it('can properly initialize', function () {
        var grid = new Grid(0, 0, 10, 10);
        expect(grid.minX).to.equal(0);
        expect(grid.minX).to.equal(0);
        expect(grid.maxX).to.equal(10);
        expect(grid.maxY).to.equal(10);
        expect(grid.getBlock.bind(grid, -1, -1)).to.throw();
        expect(grid.getBlock.bind(grid, 0, -1)).to.throw();
        expect(grid.getBlock.bind(grid, -1, 0)).to.throw();
        expect(grid.getBlock.bind(grid, 10, 10)).to.throw();
        expect(grid.getBlock.bind(grid, 10, 9)).to.throw();
        expect(grid.getBlock.bind(grid, 9, 10)).to.throw();
        expect(grid.getBlock(9, 9)).to.exist;

        expect(grid.getBlockFromVector.bind(grid, {x: 0, y: 0})).to.exist;

        expect(grid.getBlockOrNull(-1, -1)).to.not.exist;
        expect(grid.getBlockOrNull(0, -1)).to.not.exist;
        expect(grid.getBlockOrNull(-1, 0)).to.not.exist;
        expect(grid.getBlockOrNull(10, 10)).to.not.exist;
        expect(grid.getBlockOrNull(10, 9)).to.not.exist;
        expect(grid.getBlockOrNull(9, 10)).to.not.exist;

        expect(grid.getAdjacentBlocks(0, 0, false).length).to.equal(2);
        expect(grid.getAdjacentBlocks(0, 0, true).length).to.equal(3);
        expect(grid.getAdjacentBlocks(1, 0, false).length).to.equal(3);
        expect(grid.getAdjacentBlocks(1, 0, true).length).to.equal(5);
        expect(grid.getAdjacentBlocks(9, 9, false).length).to.equal(2);
        expect(grid.getAdjacentBlocks(9, 9, true).length).to.equal(3);
        expect(grid.getAdjacentBlocks(8, 9, false).length).to.equal(3);
        expect(grid.getAdjacentBlocks(8, 9, true).length).to.equal(5);

        expect(grid.blockStatus(0, 0)).to.equal(Grid.BlockStatus.IsNothing);
        grid.setBlockStatus(0, 0, 'test');
        expect(grid.blockStatus(0, 0)).to.equal('test');
    });
});