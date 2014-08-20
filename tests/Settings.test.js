describe("Settings", function () {
    var Settings;
    beforeEach(function () {
        runs(function () {
            require(["game/Settings"], function (settings) {
                Settings = settings;
            });
        });
        waitsFor(function () {
            return Settings;
        }, 300);
    });
    it("should have the block size", function () {
        expect(Settings.BlockSize).toBeDefined();
    });
});
