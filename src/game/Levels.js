define("game/Levels", ["game/Level", "game/Settings", "game/Player", "game/Buildings", "game/Units", "game/Unit"], function (Level, Settings, Player, Buildings, Units, Unit) {

    var Levels = {};

    function CreateLevel(json) {
        var height = json.MapTemplate.BuildableBlocks.length;
        var width = json.MapTemplate.BuildableBlocks[0].length;

        var level = new Level(width, height, json.StartBlock, json.MapTemplate);
        delete json.Width;
        delete json.Height;

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
                unit.X = level.StartBlock.X * Level.Settings.BlockSize + Level.Settings.BlockSize / 2;
                unit.Y = level.StartBlock.Y * Level.Settings.BlockSize + Level.Settings.BlockSize / 2;
                unit.initialize();
                return unit;
            }, w.Count);
            level.createWave(wave, w.SpawnInterval);
        }
        delete json.Waves;

        level.initialize(json);

        return level;
    }

    Levels.LevelEmpty = function () {
        var level = new Level(11, 11);

        var player = new Player(level);
        level.AddPlayer(player);
        level.Player = player;
        level.AddBuilding(new Buildings.HomeBase(level, player, 5, 5));

        return level;
    };
    Levels.LevelEmpty.Name = "Level Empty";

    Levels.LevelTest = function () {
        var level = CreateLevel({
            StartBlock: {
                X: 3,
                Y: 5
            },
            Player: { Resources: {Ammo: 0, Energy: 200, Metal: 100 } },
            WaveDelay: Settings.Second * 5,
            Buildings: [
                { constructor: "HomeBase", Template: { BlockX: 5, BlockY: 5 } },
                { constructor: "Gun", Template: { BlockX: 4, BlockY: 5 } }
            ],
            Waves: [
                { TemplateName: "UnitCircle", Count: 10, SpawnInterval: Settings.Second, Customization: { Health: 10, Radius: 3, MoveSpeed: 1 } },
                { TemplateName: "UnitCircle", Count: 10, SpawnInterval: Settings.Second, Customization: { Health: 12, Radius: 3, MoveSpeed: 1 } }
            ],
            MapTemplate: {
                BuildableBlocks: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ]
            }
        });

        return level;
    };
    Levels.LevelTest.Name = "Level Test";

    Levels.LevelOne = function () {
        var level = CreateLevel({
            Player: { Resources: {Ammo: 0, Energy: 200, Metal: 100 } },
            WaveDelay: Settings.Second * 10,
            Buildings: [
                { constructor: "HomeBase", Template: { BlockX: 10, BlockY: 10 } }
            ],
            StartBlock: {
                X: 10,
                Y: 0
            },
            Waves: [
                { TemplateName: "UnitCircle", Count: 10, SpawnInterval: Settings.Second, Customization: { Health: 10, Radius: 3, MoveSpeed: 1 } },
                { TemplateName: "UnitCircle", Count: 20, SpawnInterval: Settings.Second * 2, Customization: { Health: 35, Radius: 6, MoveSpeed: .4, FillColor: '#afa' } },
                { TemplateName: "UnitCircle", Count: 40, SpawnInterval: Settings.Second * .75, Customization: { Health: 20, Radius: 4, MoveSpeed: 1.15, FillColor: '#4f4' } },
                { TemplateName: "UnitCircle", Count: 50, SpawnInterval: Settings.Second * .75, Customization: { Health: 28, Radius: 4, MoveSpeed: .8, FillColor: '#44f' } },
                { TemplateName: "UnitCircle", Count: 60, SpawnInterval: Settings.Second * .75, Customization: { Health: 15, Radius: 4, MoveSpeed: 2, FillColor: '#f44' } },
                { TemplateName: "UnitCircle", Count: 30, SpawnInterval: Settings.Second * .5, Customization: { Health: 100, Radius: 8, MoveSpeed: .65, FillColor: '#444' } },
                { TemplateName: "UnitCircle", Count: 100, SpawnInterval: Settings.Second * .3, Customization: { Health: 10, Radius: 3, MoveSpeed: 1 } },
                { TemplateName: "UnitCircle", Count: 10, SpawnInterval: Settings.Second, Customization: { Health: 300, Radius: 10, MoveSpeed: .5 } },
            ],
            MapTemplate: {
                BuildableBlocks: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                    [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ]
            }
        });
        return level;
    };
    Levels.LevelOne.Name = "Level One";

    Levels.LevelTwo = function () {
        var level = CreateLevel({
            Player: { Resources: {Ammo: 0, Energy: 200, Metal: 100 } },
            WaveDelay: Settings.Second * 7,
            Buildings: [
                { constructor: "HomeBase", Template: { BlockX: 3, BlockY: 20 } }
            ],
            StartBlock: {
                X: 2,
                Y: 0
            },
            Waves: [
                { TemplateName: "UnitCircle", Count: 20, SpawnInterval: Settings.Second, Customization: { Health: 15, Radius: 3, MoveSpeed: 1, FillColor: '#afa' } },
                { TemplateName: "UnitCircle", Count: 20, SpawnInterval: Settings.Second, Customization: { Health: 20, Radius: 3.5, MoveSpeed: 1, FillColor: '#0fa' } },
                { TemplateName: "UnitCircle", Count: 20, SpawnInterval: Settings.Second * 2, Customization: { Health: 40, Radius: 5, MoveSpeed: 1, FillColor: '#af0' } },
                { TemplateName: "UnitCircle", Count: 20, SpawnInterval: Settings.Second * 2, Customization: { Health: 20, Radius: 2.5, MoveSpeed: 1.5, FillColor: '#a0a' } },
                { TemplateName: "UnitCircle", Count: 40, SpawnInterval: Settings.Second, Customization: { Health: 35, Radius: 3, MoveSpeed: 1, FillColor: '#00a' } },
                { TemplateName: "UnitCircle", Count: 80, SpawnInterval: Settings.Second * .5, Customization: { Health: 45, Radius: 4, MoveSpeed: 1, FillColor: '#00a' } },
            ],
            MapTemplate: {
                BuildableBlocks: [
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
                    [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ]
            }
        });

        return level;
    };
    Levels.LevelTwo.Name = "Level Two";

    return Levels;
});