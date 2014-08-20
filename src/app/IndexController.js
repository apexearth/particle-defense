define("app/IndexController", ["app/App", "game/ParticleDefense"], function (app, ParticleDefense) {
    return app.controller('IndexController', [
        '$scope', function ($scope) {
            $scope.ParticleDefense = ParticleDefense;
            ParticleDefense.IndexScope = $scope;
        }
    ]);
});