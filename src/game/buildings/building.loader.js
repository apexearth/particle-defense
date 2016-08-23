var Building = require('./Building');
var General = require('../../util/General');

module.exports = function Create(obj) {
    var constructor  = function (level, player, templates) {
        var building  = new Building(level, player, templates);
        level.addChild(building);
        building.Name = obj.name;
        if (obj.getSprite != null) {
            building.addChildAt(obj.getSprite(), 0);
        }
    
        if (obj.template.weapons !== undefined) {
            for (var w in obj.template.weapons) {
                if (obj.template.weapons.hasOwnProperty(w)) {
                    var weapon = new obj.template.weapons[w](building);
                    building.weapons.push(weapon);
                    building.addChild(weapon);
                }
            }
        }
    
        building.loadTemplate(obj.template, [obj.template.weapons, obj.template.Canvas]);
        if (obj.constructor.extendedConstructor !== undefined) obj.constructor.extendedConstructor.call(building);
        building.constructor = this.constructor;
        return building;
    };
    constructor.Name = obj.name;
    if (obj.constructor.Cost) {
        constructor.Cost = {};
        var costs        = obj.constructor.Cost;
        for (var c in costs) {
            if (costs.hasOwnProperty(c)) {
                constructor.Cost[c] = (function (cost) {
                    return function (player) {
                        return Math.pow(cost, 1 + player.getBuildingCount(obj.name) / 20);
                    };
                })(costs[c]);
            }
        }
    }
    General.NestedCopyTo(obj.constructor, constructor, [obj.constructor.Cost]);
    return constructor;
};