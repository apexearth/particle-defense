describe('Grid Tests', function () {
    var Grid;
    beforeEach(function () {
        runs(function(){
            require(["util/Grid"], function (grid) {
                Grid = grid;
            });
        });
        waitsFor(function(){
            return Grid;
        });
    });
    it('should be the master who controls the passage of time', function () {
        var grid = new Grid(0, 0, 10, 10);
        var block = grid.getBlock(1, 1);
        expect(block.X).toBe(1);
        expect(block.Y).toBe(1);
        alert("test");
    });
    it('should throw if you attempt to get a block out of the range of blocks', function () {
        var grid = new Grid(0, 0, 10, 10);
        expect(function () {
            grid.getBlock(-1, 0);
        }).toThrow();
        expect(function () {
            grid.getBlock(-1, -1);
        }).toThrow();
        expect(function () {
            grid.getBlock(0, -1);
        }).toThrow();
        expect(function () {
            grid.getBlock(11, 10);
        }).toThrow();
        expect(function () {
            grid.getBlock(11, 11);
        }).toThrow();
        expect(function () {
            grid.getBlock(10, 11);
        }).toThrow();
        expect(grid.getBlockOrNull(-1, 0)).toBeNull();
        expect(grid.getBlockOrNull(0, -1)).toBeNull();
        expect(grid.getBlockOrNull(0, 11)).toBeNull();
        expect(grid.getBlockOrNull(11, 0)).toBeNull();
        expect(grid.getBlockOrNull(0, 0)).not.toBeNull();
        expect(grid.getBlockOrNull(10, 10)).not.toBeNull();
    });
});
