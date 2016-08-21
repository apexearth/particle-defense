var loader = require('./building.loader')
var Images = require('../../img')
var Building = require('./Building')

module.exports = loader({
    name:        'MetalFab',
    constructor: {
        cost: {
            energy: 50,
            metal: 75
        },
        extendedConstructor: function () {
            Building.prototype.addStorageToPlayer.call(this);
        }
    },
    getSprite: Images.buildings.MetalFab,
    template:    {
        health: 20,
        resourceStorage: {
            metal: 50
        },
        resourceGeneration: {
            metal: 1.5
        },
        updates: []
    }
})