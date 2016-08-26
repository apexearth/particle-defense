var Level = require('./Level');
var Settings = require('../Settings');
var Player = require('../Player');
var Buildings = require('../buildings');
var SpawnPoint = require('../SpawnPoint');
var BlockStatus = require('../../util/grid/block-status');

var Levels = {
    Level: Level
};
module.exports = Levels;

function CreateLevel(json) {
    var height = json.mapTemplate.buildableBlocks.length;
    var width = json.mapTemplate.buildableBlocks[0].length;

    var level = new Level({
        width: width,
        height: height,
        mapTemplate: json.mapTemplate
    });

    var player = new Player();
    level.addPlayer(player);
    level.player = player;
    level.addPlayer(new Player());

    for (var _b in json.buildings) {
        var b = json.buildings[_b];
        var building = new Buildings[b.constructor](Object.assign({
            level: level,
            player: player
        }, b.template));
        level.addBuilding(building);
    }

    for (var _s in json.spawnPoints) {
        var s = json.spawnPoints[_s];
        level.spawnPoints.push(new SpawnPoint(level, s));
    }

    level.initialize(json.initialize);
    return level;
}

function CreateRandomLevel(json) {
    var width = 15 + Math.floor(Math.random() * (json.width || 30));
    var height = 15 + Math.floor(Math.random() * (json.height || 30));

    var template = [];
    var k, i = height;
    while (i--) {
        template[i] = [];
        k = width;
        while (k--) {
            template[i][k] = 1 + Math.floor(Math.random() * 1.2);
        }
    }

    var level = new Level({
        width: width,
        height: height,
        mapTemplate: template
    });

    var player = new Player(level);
    level.addPlayer(player);
    level.player = player;

    var randomX = Math.floor(Math.random() * width);
    var randomY = Math.floor(Math.random() * height);
    var building = new Buildings.HomeBase(level, player, {blockX: randomX, blockY: randomY});
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
            var blockStatus = template[spawnTemplate.y][spawnTemplate.x];
            if (blockStatus !== BlockStatus.OnlyPassable && blockStatus !== BlockStatus.IsEmpty) {
                spawnTemplate = null;
            }
        }
        k = 1 + Math.floor(Math.random() * 3);
        while (k--) {
            spawnTemplate.waves.push({
                unitType: 'UnitCircle',
                count: 1 + Math.floor(Math.random() * 50),
                waveDelay: Settings.second * 5,
                spawnInterval: Settings.second,
                customization: {
                    health: Math.random() * k * 5 + k,
                    radius: Math.random() * 6,
                    moveSpeed: Math.sqrt(Math.random()) * k + 1,
                    fillColor: '#afa'
                }
            });
        }
        level.spawnPoints.push(
            new SpawnPoint(level, spawnTemplate)
        );
    }

    level.initialize(json);
    return level;
}

Levels.LevelEmpty = function () {
    var level = new Level({
        width: 10,
        height: 10
    });

    var player = new Player(level);
    level.addPlayer(player);
    level.player = player;
    level.addBuilding(new Buildings.HomeBase(level, player, 5, 5));

    return level;
};
Levels.LevelEmpty.Name = 'Level Empty';

Levels.LevelTest = function () {
    return CreateLevel({
        initialize: {
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}}
        },
        buildings: [
            {constructor: 'HomeBase', template: {blockX: 5, blockY: 5}},
            {constructor: 'Gun', template: {blockX: 4, blockY: 5}}
        ],
        spawnPoints: [
            {
                x: 3,
                y: 5,
                waves: [
                    {
                        unitType: 'UnitCircle',
                        count: 10,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 10, radius: 3, moveSpeed: 1}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 10,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 12, radius: 3.5, moveSpeed: 1}
                    }
                ]

            }
        ],
        mapTemplate: {
            buildableBlocks: [
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

Levels.LevelOne = function () {
    return CreateLevel({
        initialize: {
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
        },
        waveDelay: Settings.second * 10,
        buildings: [
            {constructor: 'HomeBase', template: {blockX: 10, blockY: 10}}
        ],
        spawnPoints: [
            {
                x: 10,
                y: 0,
                waves: [
                    {
                        unitType: 'UnitCircle',
                        count: 10,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 8, radius: 3, moveSpeed: 1}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second,
                        spawnInterval: Settings.second * 3,
                        customization: {health: 24, radius: 5, moveSpeed: .6, fillColor: '#afa'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 40,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * .75,
                        customization: {health: 18, radius: 4, moveSpeed: 1.15, fillColor: '#4f4'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 50,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * 1.5,
                        customization: {health: 22, radius: 4, moveSpeed: .8, fillColor: '#44f'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 60,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * .75,
                        customization: {health: 15, radius: 4, moveSpeed: 2, fillColor: '#f44'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 30,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * .5,
                        customization: {health: 30, radius: 8, moveSpeed: .65, fillColor: '#444'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 100,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * .3,
                        customization: {health: 10, radius: 3, moveSpeed: 1}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 10,
                        waveDelay: Settings.second,
                        spawnInterval: Settings.second,
                        customization: {health: 20, radius: 2, moveSpeed: 2}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 10,
                        waveDelay: Settings.second * 10,
                        spawnInterval: Settings.second,
                        customization: {health: 100, radius: 10, moveSpeed: .5}
                    },
                ]
            }
        ],
        mapTemplate: {
            buildableBlocks: [
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

Levels.LevelTwo = function () {
    return CreateLevel({
        initialize: {
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            waveDelay: Settings.second * 7,
        },
        buildings: [
            {constructor: 'HomeBase', template: {blockX: 3, blockY: 20}}
        ],
        spawnPoints: [
            {
                x: 2,
                y: 0,
                waves: [
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 5, radius: 3, moveSpeed: 1, fillColor: '#afa'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 10, radius: 3.5, moveSpeed: 1, fillColor: '#0fa'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * 2,
                        customization: {health: 20, radius: 4, moveSpeed: 1, fillColor: '#af0'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * 2,
                        customization: {health: 20, radius: 2.5, moveSpeed: 1.5, fillColor: '#a0a'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 40,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 25, radius: 3, moveSpeed: 1, fillColor: '#00a'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 80,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * .5,
                        customization: {health: 35, radius: 4, moveSpeed: 1, fillColor: '#00a'}
                    },
                ]
            }
        ],
        mapTemplate: {
            buildableBlocks: [
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

Levels.LevelThree = function () {
    return CreateLevel({
        initialize: {
            Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            waveDelay: Settings.second * 7,
        },
        buildings: [
            {constructor: 'HomeBase', template: {blockX: 10, blockY: 15}}
        ],
        spawnPoints: [
            {
                x: 1,
                y: 0,
                waves: [
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 5, radius: 3, moveSpeed: 2, fillColor: '#afa'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 10, radius: 3.5, moveSpeed: 2, fillColor: '#0fa'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * 2,
                        customization: {health: 30, radius: 5, moveSpeed: 1, fillColor: '#af0'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 20,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * 2,
                        customization: {health: 20, radius: 2.5, moveSpeed: 2.5, fillColor: '#a0a'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 40,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second,
                        customization: {health: 25, radius: 3, moveSpeed: 2, fillColor: '#00a'}
                    },
                    {
                        unitType: 'UnitCircle',
                        count: 80,
                        waveDelay: Settings.second * 5,
                        spawnInterval: Settings.second * .5,
                        customization: {health: 35, radius: 4, moveSpeed: 2, fillColor: '#00a'}
                    },
                ]
            }
        ],
        mapTemplate: {
            buildableBlocks: [
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

Levels.Random = function () {
    return CreateRandomLevel({});
};
Levels.Random.Name = 'Random';

