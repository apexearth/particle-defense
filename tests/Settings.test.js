require(["src/game/Settings"], function (Settings) {
    describe("Settings", function () {
    it("should have the block size", function () {
            expect(Settings.BlockSize).toBeDefined();
        });
    });
});
