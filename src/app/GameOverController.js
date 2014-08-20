define("app/GameOverController", ["app/App","game/ParticleDefense"], function (app, ParticleDefense) {
    return app.controller('GameOverController', ['$scope', function ($scope) {
            $scope.Level = ParticleDefense.Level;
            $scope.Player = ParticleDefense.Level.Player;
            $scope.Result = ParticleDefense.Level.Result;
            $scope.Title = ($scope.Result.Victory ? "Victory!" : "Failure!");
            $scope.MainMenu = function () {
                ParticleDefense.View = ParticleDefense.Views.MainMenu;
                //ParticleDefense.IndexScope.$apply();
            };
        }]);
});