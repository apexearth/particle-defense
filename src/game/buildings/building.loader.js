define(["../PIXI", "../../util/General", "./building"], function (PIXI, General, Building) {
    return function Create(obj) {
        var constructor = function (level, player, templates) {
            var building = new Building(level, player, templates);
            building.Name = obj.name;
            if (obj.image != null) building.addChild(obj.image);

            if (obj.template.Weapons !== undefined) {
                for (var w in obj.template.Weapons) {
                    if (obj.template.Weapons.hasOwnProperty(w)) {
                        var weapon = new obj.template.Weapons[w](building);
                        building.Weapons.push(weapon);
                        building.addChild(weapon);
                    }
                }
            }

            building.loadTemplate(obj.template, [obj.template.Weapons, obj.template.Canvas]);
            if (obj.constructor.ExtendedConstructor !== undefined) obj.constructor.ExtendedConstructor.call(building);
            building.constructor = this.constructor;
            return building;
        };
        constructor.Name = obj.name;
        if (obj.constructor.Cost) {
            constructor.Cost = {};
            var costs = obj.constructor.Cost;
            for (var c in costs) {
                if (costs.hasOwnProperty(c)) {
                    constructor.Cost[c] = (function (cost) {
                        return function (player) {
                            return Math.pow(cost, 1 + player.GetBuildingCount(obj.name) / 20);
                        }
                    })(costs[c]);
                }
            }
        }
        General.NestedCopyTo(obj.constructor, constructor, [obj.constructor.Cost]);
        return constructor;
    }
});