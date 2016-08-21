var Level = require('./Level')
var Settings = require('./Settings')
var Player = require('./Player')
var Buildings = require('./buildings')
var Units = require('./units')
var Unit = require('./units/Unit')
var SpawnPoint = require('./SpawnPoint')
var BlockStatus = require('../util/grid/block-status')

var Levels = module.exports = {};

function CreateLevel(json) {
    var height = json.MapTemplate.BuildableBlocks.length;
    var width  = json.MapTemplate.BuildableBlocks[0].length;
    
    var level = new level(width, height, json.MapTemplate);

    var player = new Player(level);
    level.addPlayer(player);
    level.player = player;
    
    for (var _b in json.buildings) {
        var b = json.buildings[_b];
        var building = new Buildings[b.constructor](level, player, b.Template);
        level.addBuilding(building);
    }
    
    for (var _s in json.spawnPoints) {
        var s = json.spawnPoints[_s];
        level.spawnPoints.push(new SpawnPoint(level, s));
    }

    level.initialize(json.Initialize);
    return level;
}

function CreateRandomLevel(json) {
    var width  = 15 + Math.floor(Math.random() * (json.Width || 30));
    var height = 15 + Math.floor(Math.random() * (json.Height || 30));

    var template = [];
    var k, i     = height;
    while (i--) {
        template[i] = [];
        k           = width;
        while (k--) {
            template[i][k] = 1 + Math.floor(Math.random() * 1.2);
        }
    }
    
    var level = new level(width, height, {BuildableBlocks: template});

    var player = new Player(level);
    level.addPlayer(player);
    level.player = player;

    var randomX  = Math.floor(Math.random() * width);
    var randomY  = Math.floor(Math.random() * height);
    var building = new Buildings.homeBase(level, player, {BlockX: randomX, BlockY: randomY});
    level.addBuilding(building);

    // Add Spawn Points
    i = 1 + Math.floor(Math.random() * 20);
    while (i--) {
        var spawnTemplate;
        while (!spawnTemplate) {
            spawnTemplate   = {
                x:     Math.floor(Math.random() * width),
                y:     Math.floor(Math.random() * height),
                Waves: []
            };
            var blockStatus = template[spawnTemplate.y][spawnTemplate.x];
            if (blockStatus !== BlockStatus.OnlyPassable && blockStatus !== BlockStatus.IsEmpty) {
                spawnTemplate = null;
            }
        }
        k = 1 + Math.floor(Math.random() * 3);
        while (k--) {
            spawnTemplate.waves.push({
                UnitType: 'UnitCircle',
                Count:         1 + Math.floor(Math.random() * 50),
                WaveDelay: Settings.second * 5,
                SpawnInterval: Settings.second,
                Customization: {
                    Health:    Math.random() * k * 5 + k,
                    Radius:    Math.random() * 6,
                    MoveSpeed: Math.sqrt(Math.random()) * k + 1,
                    FillColor: '#afa'
                }
            });
        }
        level.spawnPoints.push(
            new SpawnPoint(level, spawnTemplate)
        )
    }

    level.initialize(json);
    return level;
}

Levels.LevelEmpty      = function () {
    var level = new level(11, 11);

    var player = new Player(level);
    level.addPlayer(player);
    level.player = player;
    level.addBuilding(new Buildings.homeBase(level, player, 5, 5));

    return level;
};
Levels.LevelEmpty.Name = 'Level Empty';

Levels.LevelTest      = function () {
    return CreateLevel({
        Initialize:  {
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}}
        },
        Buildings:   [
            {constructor: 'HomeBase', Template: {BlockX: 5, BlockY: 5}},
            {constructor: 'Gun', Template: {BlockX: 4, BlockY: 5}}
        ],
        spawnPoints: [
            {
                x:     3,
                y:     5,
                waves: [
                    {
                        UnitType: 'UnitCircle',
                        Count:         10,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 10, Radius: 3, MoveSpeed: 1}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         10,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
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
Levels.LevelTest.Name = 'Level Test';

Levels.LevelOne      = function () {
    return CreateLevel({
        Initialize:  {
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
        },
        WaveDelay: Settings.second * 10,
        Buildings:   [
            {constructor: 'HomeBase', Template: {BlockX: 10, BlockY: 10}}
        ],
        spawnPoints: [
            {
                x:     10,
                y:     0,
                waves: [
                    {
                        UnitType: 'UnitCircle',
                        Count:         10,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 8, Radius: 3, MoveSpeed: 1}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second,
                        SpawnInterval: Settings.second * 3,
                        Customization: {Health: 24, Radius: 5, MoveSpeed: .6, FillColor: '#afa'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         40,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * .75,
                        Customization: {Health: 18, Radius: 4, MoveSpeed: 1.15, FillColor: '#4f4'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         50,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * 1.5,
                        Customization: {Health: 22, Radius: 4, MoveSpeed: .8, FillColor: '#44f'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         60,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * .75,
                        Customization: {Health: 15, Radius: 4, MoveSpeed: 2, FillColor: '#f44'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         30,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * .5,
                        Customization: {Health: 30, Radius: 8, MoveSpeed: .65, FillColor: '#444'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         100,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * .3,
                        Customization: {Health: 10, Radius: 3, MoveSpeed: 1}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         10,
                        WaveDelay: Settings.second,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 20, Radius: 2, MoveSpeed: 2}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         10,
                        WaveDelay: Settings.second * 10,
                        SpawnInterval: Settings.second,
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
Levels.LevelOne.Name = 'Level One';

Levels.LevelTwo      = function () {
    return CreateLevel({
        Initialize:  {
            Player:    {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            WaveDelay: Settings.second * 7,
        },
        Buildings:   [
            {constructor: 'HomeBase', Template: {BlockX: 3, BlockY: 20}}
        ],
        spawnPoints: [
            {
                x:     2,
                y:     0,
                waves: [
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 5, Radius: 3, MoveSpeed: 1, FillColor: '#afa'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 10, Radius: 3.5, MoveSpeed: 1, FillColor: '#0fa'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * 2,
                        Customization: {Health: 20, Radius: 4, MoveSpeed: 1, FillColor: '#af0'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * 2,
                        Customization: {Health: 20, Radius: 2.5, MoveSpeed: 1.5, FillColor: '#a0a'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         40,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 25, Radius: 3, MoveSpeed: 1, FillColor: '#00a'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         80,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * .5,
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
Levels.LevelTwo.Name = 'Level Two';

Levels.LevelThree      = function () {
    return CreateLevel({
        Initialize:  {
            Player:    {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            WaveDelay: Settings.second * 7,
        },
        Buildings:   [
            {constructor: 'HomeBase', Template: {BlockX: 10, BlockY: 15}}
        ],
        spawnPoints: [
            {
                x:     1,
                y:     0,
                waves: [
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 5, Radius: 3, MoveSpeed: 2, FillColor: '#afa'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 10, Radius: 3.5, MoveSpeed: 2, FillColor: '#0fa'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * 2,
                        Customization: {Health: 30, Radius: 5, MoveSpeed: 1, FillColor: '#af0'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         20,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * 2,
                        Customization: {Health: 20, Radius: 2.5, MoveSpeed: 2.5, FillColor: '#a0a'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         40,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second,
                        Customization: {Health: 25, Radius: 3, MoveSpeed: 2, FillColor: '#00a'}
                    },
                    {
                        UnitType: 'UnitCircle',
                        Count:         80,
                        WaveDelay: Settings.second * 5,
                        SpawnInterval: Settings.second * .5,
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
Levels.LevelThree.Name = 'Level Three';

Levels.Random      = function () {
    return CreateRandomLevel({});
};
Levels.Random.Name = 'Random';

