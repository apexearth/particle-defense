define(["./building.loader", "./building"],
    function (loader, Building) {
        return loader({
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
    });