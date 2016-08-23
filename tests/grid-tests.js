describe('Grid Tests', function () {
    var Grid = require('../src/util/grid');
    var expect = require('chai').expect;

    it('should be able to deliver blocks', function () {
        var grid = new Grid(0, 0, 10, 10);
        var block = grid.getBlock(1, 1);
        expect(block.x).to.equal(1);
        expect(block.y).to.equal(1);
    });
    it('should throw if you attempt to get a block out of the range of blocks', function () {
        var grid = new Grid(0, 0, 10, 10);
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
        expect(grid.getBlockOrNull(-1, 0)).to.equal(null);
        expect(grid.getBlockOrNull(0, -1)).to.equal(null);
        expect(grid.getBlockOrNull(0, 11)).to.equal(null);
        expect(grid.getBlockOrNull(11, 0)).to.equal(null);
        expect(grid.getBlockOrNull(0, 0)).to.not.equal(null);
        expect(grid.getBlockOrNull(10, 10)).to.not.equal(null);
    });
});
