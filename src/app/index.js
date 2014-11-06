define("app/index", ["./app", "game/ParticleDefense"], function (app, ParticleDefense) {
    return app.controller('Index', ['$scope', Index]);

    function Index($scope) {
        $scope.ParticleDefense = ParticleDefense;
        ParticleDefense.IndexScope = $scope;
    }
});