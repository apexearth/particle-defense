var Level = require('./Level');
var Settings = require('../Settings');
var Player = require('../player');
var Buildings = require('../buildings');

var list = {};
var array = [
    level(function Empty() {
        return createLevel({
            initialize: {
                Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}}
            },
            buildings: [
                {constructor: 'HomeBase', template: {blockX: 5, blockY: 5}}
            ]
        });
    }),
    level(function Test() {
        return createLevel({
            initialize: {
                Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}}
            },
            buildings: [
                {constructor: 'HomeBase', template: {blockX: 5, blockY: 5}},
                {constructor: 'Gun', template: {blockX: 4, blockY: 5}}
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
    }),
    level(function One() {
        return createLevel({
            initialize: {
                Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
            },
            waveDelay: Settings.second * 10,
            buildings: [
                {constructor: 'HomeBase', template: {blockX: 10, blockY: 10}}
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
    }),
    level(function Two() {
        return createLevel({
            initialize: {
                Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
                waveDelay: Settings.second * 7,
            },
            buildings: [
                {constructor: 'HomeBase', template: {blockX: 3, blockY: 20}}
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
    }),
    level(function Three() {
        return createLevel({
            initialize: {
                Player: {Resources: {Ammo: 0, Energy: 200, Metal: 100}},
                waveDelay: Settings.second * 7,
            },
            buildings: [
                {constructor: 'HomeBase', template: {blockX: 10, blockY: 15}}
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
    }),
    level(function Random() {
        return createRandomLevel({});
    })
];
array.Level = Level;
array.list = list;
module.exports = array;

function level(fn) {
    list[fn.name] = fn;
    return fn;
}

function createLevel(json) {
    var height = 10;
    var width = 10;
    if (json.mapTemplate && json.mapTemplate.buildableBlocks) {
        height = json.mapTemplate.buildableBlocks.length;
        width = json.mapTemplate.buildableBlocks[0].length;
    }

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

    level.initialize(json.initialize);
    return level;
}

function createRandomLevel(json) {
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

    level.initialize(json);
    return level;
}
