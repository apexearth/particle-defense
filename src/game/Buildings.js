define("game/Buildings", [
    "util/General",
    "game/Buildings/Building",
    "game/Weapons",
    "game/Settings",
    "game/Buildings/Wall",
    "game/Buildings/AmmoFab",
    "game/Buildings/EnergyCollector",
    "game/Buildings/MetalFab"
], function (General, Building, Weapons, Settings, Wall, AmmoFab, EnergyCollector, MetalFab) {

    function ConstructorFromTemplate(obj) {
        var constructor = function (level, player, blockX, blockY) {
            Building.call(this, level, player, blockX, blockY);
            if (obj.template.Weapons !== undefined) {
                for (var w in obj.template.Weapons) {
                    this.Weapons.push(new obj.template.Weapons[w](this));
                }
            }
            General.CopyTo(obj.template, this, [obj.template.Weapons]);
            if(obj.constructor.ExtendedConstructor!==undefined) obj.constructor.ExtendedConstructor.call(this);
        };
        General.CopyTo(obj.constructor, constructor);
        return constructor;
    }

    var list = {};
    list.Wall = Wall;
    list.AmmoFab = AmmoFab;
    list.EnergyCollector = EnergyCollector;
    list.HomeBase = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#0a7','#222', 7),
            Cost: {
                Energy: 500,
                Metal: 200
            },
            ExtendedConstructor: function(){
                this.Player.HomeBase = this;
                Building.prototype.addStorageToPlayer.call(this);
            }
        },
        template: {
            Health: 50,
            ResourceStorage: {
                Ammo: 200,
                Metal: 100,
                Energy: 200
            },
            Updates: [
                function(){
                    this.Player.Resources.Energy += .1;
                    this.Player.Resources.Metal += .05;
                    this.Player.Resources.Ammo += .2;
                }
            ]
        }
    });
    list.MetalFab = MetalFab;
    list.Gun = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#666', 5),
            Cost: {
                Energy: 50,
                Metal: 25
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun ]
        }
    });
    list.Autogun = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#aaa', 5),
            Cost: {
                Energy: 35,
                Metal: 20
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Autogun ]
        }
    });
    list.Shotgun = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#f66', 5),
            Cost: {
                Energy: 80,
                Metal: 40
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Shotgun ]
        }
    });
    list.Cannon = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#a00', 5),
            Cost: {
                Energy: 100,
                Metal: 50
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Cannon ]
        }
    });
    list.Laser = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#2a2', 5),
            Cost: {
                Energy: 50,
                Metal: 25
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Laser ]
        }
    });


    return list;


    function CreateCanvas(color1, color2, width2) {
        var canvas = document.createElement("canvas");
        canvas.width = Settings.BlockSize;
        canvas.height = Settings.BlockSize;
        var context = canvas.getContext("2d");
        context.fillStyle = color1;
        context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
        context.strokeStyle = color2;
        context.lineWidth = width2;
        context.strokeRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
        return canvas;
    }
});