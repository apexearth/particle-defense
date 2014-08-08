/// <reference path="/js/angular.min.js" />
/// <reference path="/Angular/App.js" />
angular.module('ParticleDefense')
    .controller('IndexController', [
        '$scope', function ($scope) {
            $scope.ParticleDefense = ParticleDefense;
            ParticleDefense.IndexScope = $scope;
        }
    ]);