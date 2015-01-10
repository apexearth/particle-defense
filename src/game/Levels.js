define("game/Levels", ["game/Level", "game/Settings", "game/Player", "./buildings!", "./units!", "./units/unit", "game/SpawnPoint", "util/grid/block-status"], function (Level, Settings, Player, Buildings, Units, Unit, SpawnPoint, BlockStatus) {

    var Levels = {};

    function CreateLevel(json) {
        var height = json.MapTemplate.BuildableBlocks.length;
        var width = json.MapTemplate.BuildableBlocks[0].length;

        var level = new Level(width, height, json.MapTemplate);
        delete json.Width;
        delete json.Height;
        delete json.MapTemplate;

        var player = new Player(level);
        level.addPlayer(player);
        level.Player = player;

        for (var _b in json.Buildings) {
            var b = json.Buildings[_b];
            var building = new Buildings[b.constructor](level, player, b.Template);
            level.addBuilding(building);
        }
        delete json.Buildings;

        for (var _s in json.SpawnPoints) {
            var s = json.SpawnPoints[_s];
            level.SpawnPoints.push(new SpawnPoint(level, s));
        }
        delete json.SpawnPoints;

        level.initialize(json);
        return level;
    }

    function CreateRandomLevel(json) {
        var width = 15 + Math.floor(Math.random() * (json.Width || 30));
        var height = 15 + Math.floor(Math.random() * (json.Height || 30));

        var template = [];
        var k, i = width;
        while (i--) {
            template[i] = [];
            k = height;
            while (k--) {
                template[i][k] = 1;
            }
        }

        var level = new Level(width, height, {BuildableBlocks: template});

        var player = new Player(level);
        level.addPlayer(player);
        level.Player = player;

        var randomX = Math.floor(Math.random() * width);
        var randomY = Math.floor(Math.random() * height);
        var building = new Buildings.HomeBase(level, player, {BlockX: randomX, BlockY: randomY});
        level.addBuilding(building);

        // Add Spawn Points
        i = 1 + Math.floor(Math.random() * 20);
        while (i--) {
            var spawnTemplate;
            while (!spawnTemplate) {
                spawnTemplate = {
                    x: Math.floor(Math.random() * width),
                    y: Math.floor(Math.random() * height),
                    Waves: []
                };
                var blockStatus = template[spawnTemplate.x][spawnTemplate.y];
                if (blockStatus !== BlockStatus.OnlyPassable && blockStatus !== BlockStatus.IsEmpty) {
                    spawnTemplate = null;
                }
            }
            k = 1 + Math.floor(Math.random() * 3);
            while (k--) {
                spawnTemplate.Waves.push({
                    UnitType: "UnitCircle",
                    Count: 1 + Math.floor(Math.random() * 50),
                    WaveDelay: Settings.Second * 5,
                    SpawnInterval: Settings.Second,
                    Customization: {
                        Health: Math.random() * k * 5 + k,
                        Radius: Math.random() * 6,
                        MoveSpeed: Math.sqrt(Math.random()) * k + 1,
                        FillColor: '#afa'
                    }
                });
            }
            level.SpawnPoints.push(
                new SpawnPoint(level, spawnTemplate)
            )
        }

        level.initialize(json);
        return level;
    }

    Levels.LevelEmpty = function () {
        var level = new Level(11, 11);

        var player = new Player(level);
        level.addPlayer(player);
        level.Player = player;
        level.addBuilding(new Buildings.HomeBase(level, player, 5, 5));

        return level;
    };
    Levels.LevelEmpty.Name = "Level Empty";

    Levels.LevelTest = function () {
        return CreateLevel({
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            Buildings: [
                {constructor: "HomeBase", Template: {BlockX: 5, BlockY: 5}},
                {constructor: "Gun", Template: {BlockX: 4, BlockY: 5}}
            ],
            SpawnPoints: [
                {
                    x: 3,
                    y: 5,
                    Waves: [
                        {
                            UnitType: "UnitCircle",
                            Count: 10,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 10, Radius: 3, MoveSpeed: 1}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 10,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 12, Radius: 3.5, MoveSpeed: 1}
                        }
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
    };
    Levels.LevelTest.Name = "Level Test";

    Levels.LevelOne = function () {
        return CreateLevel({
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            WaveDelay: Settings.Second * 10,
            Buildings: [
                {constructor: "HomeBase", Template: {BlockX: 10, BlockY: 10}}
            ],
            SpawnPoints: [
                {
                    x: 10,
                    y: 0,
                    Waves: [
                        {
                            UnitType: "UnitCircle",
                            Count: 10,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 8, Radius: 3, MoveSpeed: 1}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second,
                            SpawnInterval: Settings.Second * 3,
                            Customization: {Health: 24, Radius: 5, MoveSpeed: .6, FillColor: '#afa'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 40,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * .75,
                            Customization: {Health: 18, Radius: 4, MoveSpeed: 1.15, FillColor: '#4f4'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 50,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * 1.5,
                            Customization: {Health: 22, Radius: 4, MoveSpeed: .8, FillColor: '#44f'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 60,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * .75,
                            Customization: {Health: 15, Radius: 4, MoveSpeed: 2, FillColor: '#f44'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 30,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * .5,
                            Customization: {Health: 30, Radius: 8, MoveSpeed: .65, FillColor: '#444'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 100,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * .3,
                            Customization: {Health: 10, Radius: 3, MoveSpeed: 1}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 10,
                            WaveDelay: Settings.Second,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 20, Radius: 2, MoveSpeed: 2}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 10,
                            WaveDelay: Settings.Second * 10,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 100, Radius: 10, MoveSpeed: .5}
                        },
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
    };
    Levels.LevelOne.Name = "Level One";

    Levels.LevelTwo = function () {
        return CreateLevel({
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            WaveDelay: Settings.Second * 7,
            Buildings: [
                {constructor: "HomeBase", Template: {BlockX: 3, BlockY: 20}}
            ],
            SpawnPoints: [
                {
                    x: 2,
                    y: 0,
                    Waves: [
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 5, Radius: 3, MoveSpeed: 1, FillColor: '#afa'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 10, Radius: 3.5, MoveSpeed: 1, FillColor: '#0fa'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * 2,
                            Customization: {Health: 20, Radius: 4, MoveSpeed: 1, FillColor: '#af0'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * 2,
                            Customization: {Health: 20, Radius: 2.5, MoveSpeed: 1.5, FillColor: '#a0a'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 40,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 25, Radius: 3, MoveSpeed: 1, FillColor: '#00a'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 80,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * .5,
                            Customization: {Health: 35, Radius: 4, MoveSpeed: 1, FillColor: '#00a'}
                        },
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
    };
    Levels.LevelTwo.Name = "Level Two";

    Levels.LevelThree = function () {
        return CreateLevel({
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            WaveDelay: Settings.Second * 7,
            Buildings: [
                {constructor: "HomeBase", Template: {BlockX: 10, BlockY: 15}}
            ],
            SpawnPoints: [
                {
                    x: 1,
                    y: 0,
                    Waves: [
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 5, Radius: 3, MoveSpeed: 2, FillColor: '#afa'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 10, Radius: 3.5, MoveSpeed: 2, FillColor: '#0fa'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * 2,
                            Customization: {Health: 30, Radius: 5, MoveSpeed: 1, FillColor: '#af0'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 20,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * 2,
                            Customization: {Health: 20, Radius: 2.5, MoveSpeed: 2.5, FillColor: '#a0a'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 40,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second,
                            Customization: {Health: 25, Radius: 3, MoveSpeed: 2, FillColor: '#00a'}
                        },
                        {
                            UnitType: "UnitCircle",
                            Count: 80,
                            WaveDelay: Settings.Second * 5,
                            SpawnInterval: Settings.Second * .5,
                            Customization: {Health: 35, Radius: 4, MoveSpeed: 2, FillColor: '#00a'}
                        },
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
    };
    Levels.LevelThree.Name = "Level Three";

    Levels.Random = function () {
        return CreateRandomLevel({});
    };
    Levels.Random.Name = "Random";

    return Levels;
});