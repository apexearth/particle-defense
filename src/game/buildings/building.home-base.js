define(["./building.loader", "./building"],
    function (loader, Building) {
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
    });