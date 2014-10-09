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
            this.loadTemplate(obj.template, [obj.template.Weapons]);
            if (obj.constructor.ExtendedConstructor !== undefined) obj.constructor.ExtendedConstructor.call(this);
        };
        General.CopyTo(obj.constructor, constructor);
        return constructor;
    }

    var list = {};
    list.Wall = ConstructorFromTemplate({
        constructor: { canvas: CreateCanvas('#0c9', '#3c9', 8),
            Cost: {
                Energy: 4,
                Metal: 2
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
            ResourceGeneration: {
                Ammo: 6
            },
            Updates: []
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
            ResourceGeneration: {
                Energy: 3
            },
            Updates: []
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
            ResourceGeneration: {
                Energy: 3,
                Metal: 1.5,
                Ammo: 6
            },
            Updates: []
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
            ResourceGeneration: {
                Metal: 1.5
            },
            Updates: []
        }
    });
    list.Cannon = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#666', 5),
            Cost: {
                Energy: 60,
                Metal: 30
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Cannon(75, 30, 3, 1, .95, 1) ]
        }
    });
    list.Gun1 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#666', 5),
            Cost: {
                Energy: 20,
                Metal: 10
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(75, 30, 3, 1, .95, 1) ]
        }
    });
    list.Gun2 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#666', 5),
            Cost: {
                Energy: 30,
                Metal: 15
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(85, 25, 4, 2, .96, 1) ]
        }
    });
    list.Gun3 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#666', 5),
            Cost: {
                Energy: 40,
                Metal: 20
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(100, 20, 5, 3, .97, 1) ]
        }
    });
    list.Autogun1 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#aaa', 5),
            Cost: {
                Energy: 25,
                Metal: 10
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(100, 10, 2.5, 1, .95, 1) ]
        }
    });
    list.Autogun2 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#aaa', 5),
            Cost: {
                Energy: 40,
                Metal: 15
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(100, 10, 2.5, 1.5, .95, 2) ]
        }
    });
    list.Autogun3 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#aaa', 5),
            Cost: {
                Energy: 50,
                Metal: 40
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Gun(125, 10, 3.25, 2, .95, 3) ]
        }
    });
    list.Laser1 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#2a2', 5),
            Cost: {
                Energy: 50,
                Metal: 25
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Laser(100, 60, 45, 6, .95) ]
        }
    });
    list.Laser2 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#2a2', 5),
            Cost: {
                Energy: 75,
                Metal: 35
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Laser(100, 45, 30, 6, .95) ]
        }
    });
    list.Laser3 = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#2a2', 5),
            Cost: {
                Energy: 100,
                Metal: 50
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Laser(100, 30, 20, 6, .95) ]
        }
    });
    list.Beam = ConstructorFromTemplate({
        constructor: {
            canvas: CreateCanvas('#fff', '#2a2', 5),
            Cost: {
                Energy: 25,
                Metal: 20
            }
        },
        template: {
            Health: 5,
            Weapons: [ Weapons.Laser(100, 1, 3, .05, .95) ]
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