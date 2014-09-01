define("game/Levels", ["game/Level", "game/Settings", "game/Player", "game/Buildings", "game/Units", "game/Unit"], function (Level, Settings, Player, Buildings, Units, Unit) {

    function CreateLevel(json) {
        var level = new Level(json.Width, json.Height);
        var player = new Player(level);
        level.AddPlayer(player);
        level.Player = player;

        for (var _b in json.Buildings) {
            var b = json.Buildings[_b];
            var building = new Buildings[b.constructor](level, player, b.Template);
            level.AddBuilding(building);
        }
        delete json.Buildings;

        for (var _w in json.Waves) {
            var w = json.Waves[_w];
            var wave = Units.Array(function () {
                var unit = new Unit(level);
                if (w.TemplateName !== undefined) unit.loadTemplate(Units[w.TemplateName]);
                if (w.Template !== undefined) unit.loadTemplate(w.Template);
                if (w.Customization !== undefined) unit.loadTemplate(w.Customization);
                unit.initialize();
                return unit;
            }, w.Count);
            level.createWave(wave, w.SpawnInterval);
        }
        delete json.Waves;

        level.initialize(json);

        return level;
    }

    var LevelEmpty = function () {
        var level = new Level(11, 11);

        var player = new Player(level);
        level.AddPlayer(player);
        level.Player = player;
        level.AddBuilding(new Buildings.HomeBase(level, player, 5, 5));

        return level;
    };
    LevelEmpty.Name = "Level Empty";

    var LevelTest = function () {
        var level = CreateLevel({
            Width: 11,
            Height: 11,
            Player: { Resources: {Ammo: 0, Energy: 200, Metal: 100 } },
            WaveDelay: Settings.Second * 5,
            Buildings: [
                { constructor: "HomeBase", Template: { BlockX: 5, BlockY: 5 } },
                { constructor: "Gun", Template: { BlockX: 4, BlockY: 5 } }
            ],
            Waves: [
                { TemplateName: "UnitCircle", Count: 10, SpawnInterval: Settings.Second, Customization: { X: 3 * Settings.BlockSize, Y: 5 * Settings.BlockSize, Health: 10, Radius: 3, MoveSpeed: 1 } },
                { TemplateName: "UnitCircle", Count: 10, SpawnInterval: Settings.Second, Customization: { X: 3 * Settings.BlockSize, Y: 5 * Settings.BlockSize, Health: 12, Radius: 3, MoveSpeed: 1 } }
            ]
        });

        return level;
    };
    LevelTest.Name = "Level Test";

    var LevelOne = function () {
        var level = CreateLevel({
            Width: 21,
            Height: 21,
            Player: { Resources: {Ammo: 0, Energy: 200, Metal: 100 } },
            WaveDelay: Settings.Second * 5,
            Buildings: [
                { constructor: "HomeBase", Template: { BlockX: 10, BlockY: 10 } }
            ],
            Waves: [
                { TemplateName: "UnitCircle", Count: 10, SpawnInterval: Settings.Second, Customization: { X: 10 * Settings.BlockSize, Y: 0, Health: 10, Radius: 3, MoveSpeed: 1 } },
                { TemplateName: "UnitCircle", Count: 20, SpawnInterval: Settings.Second * 2, Customization: { X: 10 * Settings.BlockSize, Y: 0, Health: 35, Radius: 6, MoveSpeed: .4, FillColor: '#afa' } },
                { TemplateName: "UnitCircle", Count: 40, SpawnInterval: Settings.Second * .75, Customization: { X: 10 * Settings.BlockSize, Y: 0, Health: 20, Radius: 4, MoveSpeed: 1.15, FillColor: '#4f4' } },
                { TemplateName: "UnitCircle", Count: 50, SpawnInterval: Settings.Second * .75, Customization: { X: 10 * Settings.BlockSize, Y: 0, Health: 35, Radius: 4, MoveSpeed: .8, FillColor: '#44f' } },
                { TemplateName: "UnitCircle", Count: 60, SpawnInterval: Settings.Second * .75, Customization: { X: 10 * Settings.BlockSize, Y: 0, Health: 15, Radius: 4, MoveSpeed: 2, FillColor: '#f44' } },
                { TemplateName: "UnitCircle", Count: 30, SpawnInterval: Settings.Second * .5, Customization: { X: 10 * Settings.BlockSize, Y: 0, Health: 100, Radius: 8, MoveSpeed: .65, FillColor: '#444' } },
                { TemplateName: "UnitCircle", Count: 100, SpawnInterval: Settings.Second * .3, Customization: { X: 10 * Settings.BlockSize, Y: 0, Health: 10, Radius: 3, MoveSpeed: 1 } }
            ]
        });

        return level;
    };
    LevelOne.Name = "Level One";

    return {
        LevelEmpty: LevelEmpty,
        LevelTest: LevelTest,
        LevelOne: LevelOne
    };
});