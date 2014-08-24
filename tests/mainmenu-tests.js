describe('Main Menu Tests', function () {
    var mocks, ParticleDefense, Level;
    beforeEach(function () {
        runs(function () {
            require(["angular-mocks", "game/ParticleDefense", "game/Level"], function (_mocks, particleDefense, level) {
                mocks = _mocks;
                ParticleDefense = particleDefense;
                Level = level;
            });
        });
        waitsFor(function () {
            return mocks;
        }, 300);
        waitsFor(function () {
            return ParticleDefense;
        }, 300);
    });
    it('should have the basics of a main menu', function () {
        mocks.module('ParticleDefense');
        mocks.inject(function ($controller) {
            var scope = {};
            var ctrl = $controller("MainMenuController", { $scope: scope });
            expect(scope.Title).toBeDefined();
            expect(scope.Levels).toBeDefined();
            expect(scope.Levels[0]() instanceof Level).toBeTruthy();
            scope.BeginLevel(scope.Levels[0], document.createElement('canvas'));
            ParticleDefense.Level = null;
        });
    });
});
