var loader   = require("./building.loader")
var Images   = require("../../img")
var Building = require("./building")

module.exports = loader({
    name:        'AmmoFab',
    constructor: {
        Cost:                {
            Energy: 100,
            Metal:  50
        },
        ExtendedConstructor: function () {
            Building.prototype.addStorageToPlayer.call(this);
        }
    },
    getSprite:   Images.Buildings.AmmoFab,
    template:    {
        Health:             20,
        ResourceStorage:    {
            Ammo: 50
        },
        ResourceGeneration: {
            Ammo: 6
        },
        Updates:            []
    }
});
