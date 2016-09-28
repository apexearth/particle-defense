var Level = require('./Level');
var Player = require('../player');
var Buildings = require('../buildings');
var Units = require('../units');

var list = {};
var array = [
    addToList(function Empty() {
        return createLevel({
            players: [
                {
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 5, blockY: 5}}
                    ]
                },
                {
                    resources: {ammo: 0, energy: 200, metal: 100}
                }
            ],
        });
    }),
    addToList(function Test() {
        return createLevel({
            players: [
                {
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 5, blockY: 5}},
                        {constructor: Buildings.Gun, template: {blockX: 4, blockY: 5}}
                    ],
                    units: [
                        {constructor: Units.Engineer, template: {position: {x: 100, y: 100}}}
                    ]
                },
                {
                    resources: {ammo: 0, energy: 200, metal: 100}
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
    }),
    addToList(function One() {
        return createLevel({
            players: [
                {
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 10, blockY: 10}}
                    ]
                },
                {
                    resources: {ammo: 0, energy: 200, metal: 100}
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
    }),
    addToList(function Two() {
        return createLevel({
            players: [
                {
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 3, blockY: 20}}
                    ]
                },
                {
                    resources: {ammo: 0, energy: 200, metal: 100}
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
    }),
    addToList(function Three() {
        return createLevel({
            players: [
                {
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 10, blockY: 15}}
                    ]
                },
                {
                    resources: {ammo: 0, energy: 200, metal: 100}
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
    }),
    addToList(function Random() {
        return createRandomLevel({});
    })
];
array.Level = Level;
array.list = list;
module.exports = array;

function addToList(fn) {
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

    for (var _p in json.players) {
        var playerSpec = json.players[_p];
        var player = new Player(playerSpec);
        level.addPlayer(player);

        for (var _b in playerSpec.buildings) {
            var b = playerSpec.buildings[_b];
            var building = new b.constructor(Object.assign({
                level: level,
                player: player
            }, b.template));
            level.addBuilding(building);
        }

        for (var _u in playerSpec.units) {
            var u = playerSpec.units[_u];
            var unit = new u.constructor(Object.assign({
                level: level,
                player: player
            }, u.template));
            level.addUnit(unit);
        }
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

    level.addPlayer(new Player());
    level.addPlayer(new Player());

    var randomX = Math.floor(Math.random() * width);
    var randomY = Math.floor(Math.random() * height);
    var building = new Buildings.HomeBase(level, level.players[0], {blockX: randomX, blockY: randomY});
    level.addBuilding(building);

    level.initialize(json);
    return level;
}
