var loader = require('./building.loader')
var Images = require('../../img')
var Building = require('./building')

module.exports = loader({
    name: 'EnergyFab',
    constructor: {
        cost: {
            energy: 125,
            metal: 50
        },
        extendedConstructor: function () {
            Building.prototype.addStorageToPlayer.call(this);
        }
    },
    getSprite: Images.buildings.EnergyFab,
    template: {
        health: 20,
        resourceStorage: {
            energy: 100
        },
        resourceGeneration: {
            energy: 3
        },
        updates: []
    }
})
