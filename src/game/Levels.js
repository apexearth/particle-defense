define("game/Levels", ["game/Level", "game/Settings", "game/Player", "game/Buildings", "game/Units", "game/Unit", "game/SpawnPoint"], function (Level, Settings, Player, Buildings, Units, Unit, SpawnPoint) {

    var Levels = {};

    function CreateLevel(json) {
        var height = json.MapTemplate.BuildableBlocks.length;
        var width = json.MapTemplate.BuildableBlocks[0].length;

        var level = new Level(width, height, json.MapTemplate);
        delete json.Width;
        delete json.Height;
        delete json.MapTemplate;

        var player = new Player(level);
        level.AddPlayer(player);
        level.Player = player;

        for (var _b in json.Buildings) {
            var b = json.Buildings[_b];
            var building = new Buildings[b.constructor](level, player, b.Template);
            level.AddBuilding(building);
        }
        delete json.Buildings;

        for(var _s in json.SpawnPoints){
            var s = json.SpawnPoints[_s];
            level.SpawnPoints.push(new SpawnPoint(level, s));
        }
        delete json.SpawnPoints;

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
            Player: { Resources: {Ammo: 0, Energy: 200, Metal: 100 } },
            Buildings: [
                { constructor: "HomeBase", Template: { BlockX: 5, BlockY: 5 } },
                { constructor: "Gun", Template: { BlockX: 4, BlockY: 5 } }
            ],
            SpawnPoints: [
                {
                    X: 3,
                    Y: 5,
                    Waves: [
                        { TemplateName: "UnitCircle", Count: 10, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 10, Radius: 3, MoveSpeed: 1 } },
                        { TemplateName: "UnitCircle", Count: 10, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 12, Radius: 3, MoveSpeed: 1 } }
                    ]

                }
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
            SpawnPoints: [
                {
                    X: 10,
                    Y: 0,
                    Waves: [
                        { TemplateName: "UnitCircle", Count: 10, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 8, Radius: 3, MoveSpeed: 1 } },
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second, SpawnInterval: Settings.Second * 3, Customization: { Health: 24, Radius: 5, MoveSpeed: .6, FillColor: '#afa' } },
                        { TemplateName: "UnitCircle", Count: 40, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * .75, Customization: { Health: 18, Radius: 4, MoveSpeed: 1.15, FillColor: '#4f4' } },
                        { TemplateName: "UnitCircle", Count: 50, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * 1.5, Customization: { Health: 22, Radius: 4, MoveSpeed: .8, FillColor: '#44f' } },
                        { TemplateName: "UnitCircle", Count: 60, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * .75, Customization: { Health: 15, Radius: 4, MoveSpeed: 2, FillColor: '#f44' } },
                        { TemplateName: "UnitCircle", Count: 30, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * .5, Customization: { Health: 30, Radius: 8, MoveSpeed: .65, FillColor: '#444' } },
                        { TemplateName: "UnitCircle", Count: 100, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * .3, Customization: { Health: 10, Radius: 3, MoveSpeed: 1 } },
                        { TemplateName: "UnitCircle", Count: 10, WaveDelay: Settings.Second, SpawnInterval: Settings.Second, Customization: { Health: 20, Radius: 2, MoveSpeed: 2 } },
                        { TemplateName: "UnitCircle", Count: 10, WaveDelay: Settings.Second * 10, SpawnInterval: Settings.Second, Customization: { Health: 100, Radius: 10, MoveSpeed: .5 } },
                    ]
                }
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
            SpawnPoints: [
                {
                    X: 2,
                    Y: 0,
                    Waves: [
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 5, Radius: 3, MoveSpeed: 1, FillColor: '#afa' } },
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 10, Radius: 3.5, MoveSpeed: 1, FillColor: '#0fa' } },
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * 2, Customization: { Health: 20, Radius: 4, MoveSpeed: 1, FillColor: '#af0' } },
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * 2, Customization: { Health: 20, Radius: 2.5, MoveSpeed: 1.5, FillColor: '#a0a' } },
                        { TemplateName: "UnitCircle", Count: 40, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 25, Radius: 3, MoveSpeed: 1, FillColor: '#00a' } },
                        { TemplateName: "UnitCircle", Count: 80, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * .5, Customization: { Health: 35, Radius: 4, MoveSpeed: 1, FillColor: '#00a' } },
                    ]
                }
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
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 5, 5],
                    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 5, 5],
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

    Levels.LevelThree = function () {
        var level = CreateLevel({
            Player: { Resources: {Ammo: 0, Energy: 200, Metal: 100 } },
            WaveDelay: Settings.Second * 7,
            Buildings: [
                { constructor: "HomeBase", Template: { BlockX: 10, BlockY: 15 } }
            ],
            SpawnPoints: [
                {
                    X: 1,
                    Y: 0,
                    Waves: [
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 5, Radius: 3, MoveSpeed: 2, FillColor: '#afa' } },
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 10, Radius: 3.5, MoveSpeed: 2, FillColor: '#0fa' } },
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * 2, Customization: { Health: 30, Radius: 5, MoveSpeed: 1, FillColor: '#af0' } },
                        { TemplateName: "UnitCircle", Count: 20, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * 2, Customization: { Health: 20, Radius: 2.5, MoveSpeed: 2.5, FillColor: '#a0a' } },
                        { TemplateName: "UnitCircle", Count: 40, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second, Customization: { Health: 25, Radius: 3, MoveSpeed: 2, FillColor: '#00a' } },
                        { TemplateName: "UnitCircle", Count: 80, WaveDelay: Settings.Second * 5, SpawnInterval: Settings.Second * .5, Customization: { Health: 35, Radius: 4, MoveSpeed: 2, FillColor: '#00a' } },
                    ]
                }
            ],
            MapTemplate: {
                BuildableBlocks: [
                    [3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
                    [3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3],
                    [3, 2, 3, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 2, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 2, 2, 2, 2, 2, 2, 5, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 5, 5, 5, 5, 5, 2, 5, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 3, 3, 3, 3, 5, 2, 5, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 3, 3, 3, 3, 5, 2, 5, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 3, 3, 3, 3, 5, 2, 5, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 3, 3, 3, 3, 5, 3, 5, 3, 3, 3, 3, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 3, 2, 3],
                    [3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3],
                    [3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3],
                    [3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                ]
            }
        });

        return level;
    };
    Levels.LevelThree.Name = "Level Three";

    return Levels;
});