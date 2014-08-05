/// <reference path="~/js/jasmine.js" />
/// <reference path="~/js/angular.min.js" />
/// <reference path="~/js/angular-mocks.js" />
/// <reference path="~/Angular/App.js"/>
/// <reference path="~/Angular/GameUiController.js"/>
/// <reference path="~/Game/Levels/LevelTest.js"/>
/// <reference path="~/Game/Level.js"/>
/// <reference path="~/Game/ParticleDefense.js"/>

describe('Game UI Tests', function () {
    beforeEach(function () {
        module('ParticleDefense');
    });
    it('should have the basics of a main menu', function () {
        inject(function ($controller) {
            var scope = {};
            ParticleDefense.startLevel(Level.LevelTest, document.createElement('canvas'));
            var ctrl = $controller("GameUiController", { $scope: scope });
            expect(scope.Player).toBeDefined();
        });
    });
});
