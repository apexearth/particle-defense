define(["../PIXI", "../Settings", "./building.loader", "./building"], function (PIXI, Settings, loader, Building) {
    return loader({
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

});