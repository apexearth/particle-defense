define("app/MainMenuController", ["app/App", "game/ParticleDefense","game/Levels"], function (app, ParticleDefense, Levels) {
    return app.controller('MainMenuController', ['$scope', 'Canvas', function ($scope, canvas) {
            $scope.Title = "Particle Defense";
            $scope.Levels = [
                Levels.LevelTest,
                Levels.LevelOne
            ];
            $scope.BeginLevel = function (level) {
                ParticleDefense.startLevel(level, canvas);
            };
            //$scope.BeginLevel($scope.Levels[0]);
        }]);
});