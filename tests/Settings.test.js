describe("Settings", function () {
    var Settings = require("../src/game/Settings");
    var expect = require("chai").expect;
    it("should have the block size", function () {
        expect(Settings.BlockSize).to.not.be.undefined;
    });
});
