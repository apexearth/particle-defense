define(["../PIXI", "../Settings", "./building.loader", "./building"],
    function (PIXI, Settings, loader, Building) {
        return loader({
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
            image: (function () {
                var graphics = new PIXI.Graphics();
                graphics.beginFill(0xA0FFA0, 1);
                graphics.drawRect(1, 1, Settings.BlockSize - 2, Settings.BlockSize - 2);
                graphics.beginFill(0x88AA88, .6);
                graphics.drawRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
                graphics.beginFill(0x44AA44, .3);
                graphics.drawRect(10, 10, Settings.BlockSize - 20, Settings.BlockSize - 20);
                graphics.position.x = graphics.position.y = -Settings.BlockSize / 2;
                return graphics;
            })(),
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
    });