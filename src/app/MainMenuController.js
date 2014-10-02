define("app/MainMenuController", ["app/App", "game/ParticleDefense","game/Levels"], function (app, ParticleDefense, Levels) {
    function MainMenuController($scope, canvas){
        $scope.Title = "Particle Defense";
        $scope.Levels = [
            Levels.LevelTest,
            Levels.LevelOne,
            Levels.LevelTwo,
            Levels.LevelThree
        ];
        $scope.BeginLevel = function (level) {
            ParticleDefense.startLevel(level, canvas);
        };
        //$scope.BeginLevel($scope.Levels[0]);
    }
    app.controller('MainMenuController', ['$scope', 'Canvas', MainMenuController]);
    return MainMenuController;
});