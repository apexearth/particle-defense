define("app/gameover", ["./app", "game/ParticleDefense"], function (app, ParticleDefense) {

    return app.controller('GameOver', ['$scope', GameOver]);

    function GameOver($scope) {
        $scope.Level = ParticleDefense.Level;
        $scope.Player = ParticleDefense.Level.Player;
        $scope.Result = ParticleDefense.Level.Result;
        $scope.Title = ($scope.Result.Victory ? "Victory!" : "Failure!");
        $scope.MainMenu = function () {
            ParticleDefense.View = ParticleDefense.Views.MainMenu;
            //ParticleDefense.IndexScope.$apply();
        };
    }
});