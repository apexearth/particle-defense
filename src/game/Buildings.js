define("game/Buildings", [
        "./PIXI",
        "../util/General",
        "./Building",
        "./Weapons",
        "./Settings",
        "color",
        "./Images"
    ], function (PIXI, General, Building, Weapons, Settings, Color, Images) {

        var list = {};

        function Create(obj) {
            var constructor = function (level, player, templates) {
                var building = new PIXI.DisplayObjectContainer();
                level.addChild(building);

                building.Name = obj.name;
                Building.call(building, level, player, templates);
                if (obj.template.Canvas != null) obj.template.Canvas(building.canvas);
                var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(building.canvas));
                sprite.anchor.x = sprite.anchor.y = .5;
                building.addChild(sprite);

                if (obj.template.Weapons !== undefined) {
                    for (var w in obj.template.Weapons) {
                        if (obj.template.Weapons.hasOwnProperty(w))
                            building.Weapons.push(new obj.template.Weapons[w](building));
                    }
                }

                building.loadTemplate(obj.template, [obj.template.Weapons, obj.template.Canvas]);
                if (obj.constructor.ExtendedConstructor !== undefined) obj.constructor.ExtendedConstructor.call(building);
                building.constructor = this.constructor;
                return building;
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
            General.NestedCopyTo(obj.constructor, constructor, [obj.constructor.Cost]);
            list[obj.name] = constructor;
        }

        Create({
            name: 'Wall',
            constructor: {
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
                Canvas: function (canvas) {
                    var context = canvas.getContext("2d");
                    context.fillStyle = 'rgba(200,2555,200,1)';
                    context.fillRect(1, 1, canvas.width - 2, canvas.height - 2);
                    context.fillStyle = 'rgba(100,125,100,.6)';
                    context.fillRect(5, 5, canvas.width - 10, canvas.height - 10);
                    context.fillStyle = 'rgba(50,125,50,.3)';
                    context.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
                },
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
                Cost: {
                    Energy: 35,
                    Metal: 20
                }
            },
            template: {
                Health: 5,
                Weapons: [ Weapons.Gun(100, 15, 2.5, .5, .85, 3) ]
            }
        });
        Create({
            name: 'MachineGun',
            constructor: {
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
                Cost: {
                    Energy: 25,
                    Metal: 20
                }
            },
            template: {
                Health: 5,
                Canvas: function (canvas) {
                    // nothing yet
                },
                Weapons: [ Weapons.Shocker(100, 30, 10, 1) ]
            }
        });

        return list;


    }
);