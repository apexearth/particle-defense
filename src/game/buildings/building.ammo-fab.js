define(["./building.loader"], function(loader){
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