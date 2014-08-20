define("app/App", ["angular"], function (angular) {
    return angular.module("ParticleDefense", [])
        .factory('Canvas', function () {
            return document.getElementById('canvas') || document.createElement('canvas');
        });
});