define("game/Buildings", [
    "util/General",
    "game/Buildings/Building",
    "game/Weapons",
    "game/Settings",
    "game/Buildings/Wall",
    "game/Buildings/AmmoFab",
    "game/Buildings/EnergyCollector",
    "game/Buildings/HomeBase",
    "game/Buildings/MetalFab",
    "game/Buildings/Gun",
    "game/Buildings/Autogun",
    "game/Buildings/Shotgun",
    "game/Buildings/Cannon"
], function (General, Building, Weapons, Settings, Wall, AmmoFab, EnergyCollector, HomeBase, MetalFab, Gun, Autogun, Shotgun, Cannon) {

    function ConstructorFromTemplate(obj) {
        var constructor = function (level, player, blockX, blockY) {
            Building.call(this, level, player, blockX, blockY);
            if (obj.template.Weapons !== undefined) {
                for (var w in obj.template.Weapons) {
                    this.Weapons.push(new obj.template.Weapons[w](this));
                }
            }
            General.CopyTo(obj.template, this, [obj.template.Weapons]);
        };
        General.CopyTo(obj.constructor, constructor);
        return constructor;
    }

    var list = {};
    list.Wall = Wall;
    list.AmmoFab = AmmoFab;
    list.EnergyCollector = EnergyCollector;
    list.HomeBase = HomeBase;
    list.MetalFab = MetalFab;
    list.Gun = Gun;
    list.Autogun = Autogun;
    list.Shotgun = Shotgun;
    list.Cannon = Cannon;

    list.Laser2 = ConstructorFromTemplate({
        constructor: {
            canvas: (function () {
                var canvas = document.createElement("canvas");
                canvas.width = Settings.BlockSize;
                canvas.height = Settings.BlockSize;
                var context = canvas.getContext("2d");
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
                context.strokeStyle = '#228822';
                context.lineWidth = 6;
                context.strokeRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
                return canvas;
            })(),
            Cost: {
                Energy: 50,
                Metal: 25
            }
        },
        template: {
            Health: 5,
            Weapons: [
                Weapons.Laser
            ]
        }
    });
    list.Laser = (function () {
        var canvas = document.createElement("canvas");
        var building = function (level, player, blockX, blockY) {
            Building.call(this, level, player, blockX, blockY);
            this.Health = 5;
            this.Weapons.push(new Weapons.Laser(this));
        };
        building.canvas = canvas;
        building.Cost = {
            Energy: 50,
            Metal: 25
        };

        (function () {
            canvas.width = Settings.BlockSize;
            canvas.height = Settings.BlockSize;
            var context = canvas.getContext("2d");
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
            context.strokeStyle = '#228822';
            context.lineWidth = 6;
            context.strokeRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
        })()
        return building;
    })();

    return list;

});