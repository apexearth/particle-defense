define("app/mainmenu", ["./app", "game/ParticleDefense", "game/Levels"], function (app, ParticleDefense, Levels) {

    app.controller('MainMenu', ['$scope', MainMenu]);
    return MainMenu;

    function MainMenu($scope) {
        $scope.Title = "Particle Defense";
        $scope.Levels = [
            Levels.LevelTest,
            Levels.LevelOne,
            Levels.LevelTwo,
            Levels.LevelThree
        ];
        $scope.BeginLevel = function (level) {
            ParticleDefense.startLevel(level);
        };
        //$scope.BeginLevel($scope.Levels[0]);
    }

});