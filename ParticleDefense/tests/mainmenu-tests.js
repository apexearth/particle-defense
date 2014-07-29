/// <reference path="~/js/jasmine.js" />
/// <reference path="~/js/angular.min.js" />
/// <reference path="~/js/angular-mocks.js" />
/// <reference path="~/Angular/App.js"/>
/// <reference path="~/Angular/MainMenuController.js"/>

describe('Main Menu Tests', function () {
    beforeEach(function () {
        module('ParticleDefense');
    });
    it('should have the basics of a main menu', function () {
        inject(function ($controller) {
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
