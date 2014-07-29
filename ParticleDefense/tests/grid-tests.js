﻿/// <reference path="~/js/jasmine.js" />
/// <reference path="~/util/Grid.js"/>
describe('Grid Tests', function () {
    it('should be the master who controls the passage of time', function () {
        var grid = new Grid(0, 0, 10, 10);
        var block = grid.getBlock(1, 1);
        expect(block.X).toBe(1);
        expect(block.Y).toBe(1);
    });
    it('should throw if you attempt to get a block out of the range of blocks', function () {
        var grid = new Grid(0, 0, 10, 10);
        expect(function () { grid.getBlock(-1, 0); }).toThrow();
        expect(function () { grid.getBlock(-1, -1); }).toThrow();
        expect(function () { grid.getBlock(0, -1); }).toThrow();
        expect(function () { grid.getBlock(11, 10); }).toThrow();
        expect(function () { grid.getBlock(11, 11); }).toThrow();
        expect(function () { grid.getBlock(10, 11); }).toThrow();
    });
});
