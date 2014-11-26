define(["../../img!", "../Settings", "./building.loader", "./building"], function (Images, Settings, loader, Building) {
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
        getSprite: Images.Buildings.AmmoFab,
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