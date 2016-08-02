var loader   = require("./building.loader")
var Images   = require("../../img")
var Building = require("./Building")

module.exports = loader({
    name:        'MetalFab',
    constructor: {
        Cost:                {
            Energy: 50,
            Metal:  75
        },
        ExtendedConstructor: function () {
            Building.prototype.addStorageToPlayer.call(this);
        }
    },
    getSprite:   Images.Buildings.MetalFab,
    template:    {
        Health:             20,
        ResourceStorage:    {
            Metal: 50
        },
        ResourceGeneration: {
            Metal: 1.5
        },
        Updates:            []
    }
})