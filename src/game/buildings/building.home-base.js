var loader   = require("./building.loader")
var Images   = require("../../img")
var Building = require("./building")

module.exports =  loader({
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
            getSprite: Images.Buildings.HomeBase,
            imageScale: 2,
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
        })