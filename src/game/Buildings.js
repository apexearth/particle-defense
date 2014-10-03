define("game/Buildings", [
    "util/General",
    "game/Building",
    "game/Weapons",
    "game/Settings"
], function (General, Building, Weapons, Settings) {

    function ConstructorFromTemplate(obj) {
        var constructor = function (level, player, templates) {
            Building.call(this, level, player, templates);
            if (obj.template.Weapons !== undefined) {
                for (var w in obj.template.Weapons) {
                    this.Weapons.push(new obj.template.Weapons[w](this));
                }
            }
            General.CopyTo(obj.template, this, [obj.template.Weapons]);
            if (obj.constructor.ExtendedConstructor !== undefined) obj.constructor.ExtendedConstructor.call(this);
        };
        General.CopyTo(obj.constructor, constructor);
        return constructor;
    }

    var list = {};
    list.Wall = ConstructorFromTemplate({
        constructor: { canvas: CreateCanvas('#0c9', '#3c9', 8),
            Cost: {
                Energy: 10,
                Metal: 5
            }},
        template: {
            Health: 20
        }
    });
    list.AmmoFab = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#5a4', '#811', 7),
            Cost: {
                Energy: 100,
                Metal: 50
            },
            ExtendedConstructor: function () {
                Building.prototype.addStorageToPlayer.call(this);
            }
        },
        template: {
            Health: 20,
            ResourceStorage: {
                Ammo: 50
            },
            Updates: [
                function () {
                    this.Player.Resources.Ammo += .1;
                }
            ]
        }
    });
    list.EnergyFab = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#5a4', '#118', 7),
            Cost: {
                Energy: 125,
                Metal: 50
            },
            ExtendedConstructor: function () {
                Building.prototype.addStorageToPlayer.call(this);
            }
        },
        template: {
            Health: 20,
            ResourceStorage: {
                Energy: 100
            },
            Updates: [
                function () {
                    this.Player.Resources.Energy += .05;
                }
            ]
        }
    });
    list.HomeBase = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#0a7', '#222', 7),
            Cost: {
                Energy: 500,
                Metal: 200
            },
            ExtendedConstructor: function () {
                if (this.Player) this.Player.HomeBase = this;
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
                function () {
                    this.Player.Resources.Energy += .1;
                    this.Player.Resources.Metal += .05;
                    this.Player.Resources.Ammo += .2;
                }
            ]
        }
    });
    list.MetalFab = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#5a4', '#111', 7),
            Cost: {
                Energy: 50,
                Metal: 75
            },
            ExtendedConstructor: function () {
                Building.prototype.addStorageToPlayer.call(this);
            }
        },
        template: {
            Health: 20,
            ResourceStorage: {
                Metal: 50
            },
            Updates: [
                function () {
                    this.Player.Resources.Metal += .025;
                }
            ]
        }
    });
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
            Weapons: [ Weapons.Gun(125, 20, 4, 5, .96) ]
        }
    });
    list.Autogun = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#aaa', 5),
            Cost: {
                Energy: 25,
                Metal: 10
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(100, 10, 2.5, 1, .95) ]
        }
    });
    list.TinyGun = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#aaa', 5),
            Cost: {
                Energy: 7,
                Metal: 2
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(100, 30, 2, .75, .95) ]
        }
    });
    list.SmallGun = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#aaa', 5),
            Cost: {
                Energy: 15,
                Metal: 5
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(110, 30, 3, 1.5, .95) ]
        }
    });
    list.Rifle = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#7aa', 5),
            Cost: {
                Energy: 100,
                Metal: 50
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(200, 45, 6, 8, .99) ]
        }
    });
    list.RepeatingRifle = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#0aa', 5),
            Cost: {
                Energy: 200,
                Metal: 100
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(200, 10, 6, 8, .97) ]
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
            Weapons: [ Weapons.Gun(150, 40, 3.25, 6,.95) ]
        }
    });
    list.Laser = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#2a2', 5),
            Cost: {
                Energy: 100,
                Metal: 50
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Laser ]
        }
    });
    list.ShitMissile = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#88a', '#44a', 5),
            Cost: {
                Energy: 75,
                Metal: 40
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Missile(175, 45, 2, .15, 6, 1) ]
        }
    });
    list.ShitTorpedo = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#bba', '#44a', 5),
            Cost: {
                Energy: 75,
                Metal: 40
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Missile(150, 60, 1, .1, 10, 1) ]
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