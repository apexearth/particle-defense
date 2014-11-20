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
        image: PIXI.Texture.fromImage("./img/buildings/homebase.png", false, 1),
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