describe('Main Menu Tests', function () {
    var MainMenuController, ParticleDefense, Level;
    beforeEach(function () {
        runs(function () {
            require(["app/MainMenuController", "game/ParticleDefense", "game/Level"], function (mainMenuController, particleDefense, level) {
                MainMenuController = mainMenuController;
                ParticleDefense = particleDefense;
                Level = level;
            });
        });
        waitsFor(function () {
            return MainMenuController;
        }, 300);
        waitsFor(function () {
            return ParticleDefense;
        }, 300);
        waitsFor(function () {
            return Level;
        }, 300);
    });
    it('should have the basics of a main menu', function () {
        var scope = {};
        var canvas = document.createElement('canvas');
        var ctrl = new MainMenuController(scope, canvas);
        expect(scope.Title).toBeDefined();
        expect(scope.Levels).toBeDefined();
        expect(scope.Levels[0]() instanceof Level).toBeTruthy();
        scope.BeginLevel(scope.Levels[0]);
        ParticleDefense.Level = null;
    });
});
