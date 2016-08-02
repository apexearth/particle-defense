var loader   = require("./building.loader")
var Images   = require("../../img")
var Building = require("./building")

module.exports = loader({
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
        getSprite: Images.Buildings.EnergyFab,
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
    })
