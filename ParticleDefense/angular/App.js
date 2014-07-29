/// <reference path="/js/angular.min.js" />
angular.module("ParticleDefense", [])
.factory('Canvas',function () {
    return document.getElementById('canvas') || document.createElement('canvas');
});