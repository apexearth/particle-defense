define("game/Buildings", [
        "util/General",
        "game/Building",
        "game/Weapons",
        "game/Settings"
    ], function (General, Building, Weapons, Settings) {

        var list = {};

        function Create(obj) {
            var constructor = function (level, player, templates) {
                this.Name = obj.name;
                Building.call(this, level, player, templates);
                if (obj.template.Weapons !== undefined) {
                    for (var w in obj.template.Weapons) {
                        if (obj.template.Weapons.hasOwnProperty(w))
                            this.Weapons.push(new obj.template.Weapons[w](this));
                    }
                }

                this.loadTemplate(obj.template, [obj.template.Weapons, obj.template.Cost]);
                if (obj.constructor.ExtendedConstructor !== undefined) obj.constructor.ExtendedConstructor.call(this);
            };
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
            General.CopyTo(obj.constructor, constructor, [obj.constructor.Cost]);
            list[obj.name] = constructor;
        }

        Create({
            name: 'Wall',
            constructor: { canvas: CreateCanvas('#0c9', '#3c9', 8),
                Cost: {
                    Energy: 4,
                    Metal: 2
                }
            },
            template: {
                Health: 20
            }
        });
        Create({
            name: 'AmmoFab',
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
        Create({
            name: 'EnergyFab',
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
        Create({
            name: 'HomeBase',
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
        Create({
            name: 'MetalFab',
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
        Create({
            name: 'Cannon',
            constructor: {
                canvas: CreateCanvas('#fff', '#666', 5),
                Cost: {
                    Energy: 60,
                    Metal: 30
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Cannon(100, 30, 3, 1.5, .95, 1, .35, 1, 5) ]
            }
        });
        Create({
            name: 'MissileLauncher',
            constructor: {
                canvas: CreateCanvas('#aaf', '#227', 5),
                Cost: {
                    Energy: 60,
                    Metal: 30
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Missile(150, 45, 2, .1, 1, .95, .5, 1, 8) ]
            }
        });
        Create({
            name: 'GrenadeLauncher',
            constructor: {
                canvas: CreateCanvas('#fff', '#666', 5),
                Cost: {
                    Energy: 60,
                    Metal: 30
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.GrenadeLauncher(100, 30, 3, 2, 1, .95, 1, .35, 1, 5) ]
            }
        });
        Create({
            name: 'LethargicCannon',
            constructor: {
                canvas: CreateCanvas('#fff', '#666', 5),
                Cost: {
                    Energy: 60,
                    Metal: 30
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Cannon(85, 30, 1.75, 1.75, .95, 1, .15, 4, 7) ]
            }
        });
        Create({
            name: 'Gun',
            constructor: {
                canvas: CreateCanvas('#fff', '#666', 5),
                Cost: {
                    Energy: 20,
                    Metal: 10
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Gun(100, 30, 3, 1, .95, 1) ]
            }
        });
        Create({
            name: 'FastGun',
            constructor: {
                canvas: CreateCanvas('#fff', '#666', 5),
                Cost: {
                    Energy: 30,
                    Metal: 15
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Gun(75, 25, 5, 1, .96, 1) ]
            }
        });
        Create({
            name: 'SharpShooter',
            constructor: {
                canvas: CreateCanvas('#fff', '#666', 5),
                Cost: {
                    Energy: 40,
                    Metal: 20
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Gun(150, 20, 7, 3, .97, 1) ]
            }
        });
        Create({
            name: 'CrossEyes',
            constructor: {
                canvas: CreateCanvas('#fff', '#aaa', 5),
                Cost: {
                    Energy: 35,
                    Metal: 20
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Gun(100, 5, 2.5, 1.25, .85, 3) ]
            }
        });
        Create({
            name: 'MachineGun',
            constructor: {
                canvas: CreateCanvas('#fff', '#aaa', 5),
                Cost: {
                    Energy: 45,
                    Metal: 20
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Gun(100, 5, 2.5, 1.25, .9, 2) ]
            }
        });
        Create({
            name: 'Behemoth',
            constructor: {
                canvas: CreateCanvas('#fff', '#aaa', 5),
                Cost: {
                    Energy: 50,
                    Metal: 40
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Gun(300, 60, 8, 6, .98, 1) ]
            }
        });
        Create({
            name: 'Laser',
            constructor: {
                canvas: CreateCanvas('#fff', '#2a2', 5),
                Cost: {
                    Energy: 50,
                    Metal: 25
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Laser(100, 60, 45, 4, .95) ]
            }
        });
        Create({
            name: 'Beam',
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
        Create({
            name: 'Shocker',
            constructor: {
                canvas: CreateCanvas('#fff', '#2a2', 5),
                Cost: {
                    Energy: 25,
                    Metal: 20
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Shocker(100, 30, 10, 1) ]
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
    }
)
;