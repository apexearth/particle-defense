/// <reference path="/js/angular.min.js" />
/// <reference path="/Angular/App.js" />
angular.module('ParticleDefense')
    .controller('IndexController', [
        '$scope', function ($scope) {
            $scope.View = 'views/mainmenu.html';
        }
    ]);