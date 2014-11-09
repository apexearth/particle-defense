define(["./building.loader", "./building"], function (loader, Building) {
    return loader({
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

});