const Level = require('./Level');
const Player = require('../player');
const Buildings = require('../buildings');
const Units = require('../units');

var list = {};
var array = [
    addToList(function Empty() {
        return createLevel({
            players: [
                {
                    color: 0xFF0000,
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 2, blockY: 5}}
                    ]
                },
                {
                    color: 0x00FF00,
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 8, blockY: 5}}
                    ]
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
                grid: [
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
                    color: 0xFF0000,
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 5, blockY: 10}}
                    ]
                },
                {
                    color: 0x0000FF,
                    resources: {ammo: 0, energy: 200, metal: 100},
                    buildings: [
                        {constructor: Buildings.HomeBase, template: {blockX: 15, blockY: 10}}
                    ]
                }
            ],
            mapTemplate: {
                grid: [
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
    if (json.mapTemplate && json.mapTemplate.grid) {
        height = json.mapTemplate.grid.length;
        width = json.mapTemplate.grid[0].length;
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

    let level = new Level({
        width: width,
        height: height,
        mapTemplate: template
    });

    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
        let player = new Player();
        level.addPlayer(player);
        let randomX = Math.floor(Math.random() * width);
        let randomY = Math.floor(Math.random() * height);
        let building = new Buildings.HomeBase({
            level,
            player,
            blockX: randomX,
            blockY: randomY
        });
        level.addBuilding(building);
    }


    level.initialize(json);
    return level;
}
