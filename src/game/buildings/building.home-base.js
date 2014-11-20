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
            image: PIXI.Texture.fromImage("./img/buildings/homebase.png", false, 1),
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