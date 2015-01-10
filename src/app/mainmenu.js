define("app/mainmenu", ["./app", "game/ParticleDefense", "game/Levels"], function (app, ParticleDefense, Levels) {

    app.controller('MainMenu', ['$scope', MainMenu]);
    return MainMenu;

    function MainMenu($scope) {
        $scope.Title = "...";
        $scope.Levels = [
            Levels.LevelTest,
            Levels.LevelOne,
            Levels.LevelTwo,
            Levels.LevelThree,
            Levels.Random
        ];
        $scope.BeginLevel = function (level) {
            ParticleDefense.startLevel(level);
        };
        //$scope.BeginLevel($scope.Levels[0]);
    }

});