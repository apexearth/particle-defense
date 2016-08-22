var loader = require('./building.loader');
var Images = require('../../img');
var Building = require('./building');

module.exports = loader({
    name:        'AmmoFab',
    constructor: {
        cost: {
            energy: 100,
            metal: 50
        },
        extendedConstructor: function () {
            Building.prototype.addStorageToPlayer.call(this);
        }
    },
    getSprite: Images.buildings.AmmoFab,
    template:    {
        health: 20,
        resourceStorage: {
            ammo: 50
        },
        resourceGeneration: {
            ammo: 6
        },
        updates: []
    }
});
