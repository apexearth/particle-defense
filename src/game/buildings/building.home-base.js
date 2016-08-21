var loader = require('./building.loader')
var Images = require('../../img')
var Building = require('./building')

module.exports = loader({
    name: 'HomeBase',
    constructor: {
        cost: {
            energy: 500,
            metal: 200
        },
        extendedConstructor: function () {
            if (this.player) this.player.homeBase = this;
            Building.prototype.addStorageToPlayer.call(this);
        }
    },
    getSprite: Images.buildings.homeBase,
    imageScale: 2,
    template: {
        health: 50,
        resourceStorage: {
            ammo: 200,
            metal: 100,
            energy: 200
        },
        resourceGeneration: {
            energy: 3,
            metal: 1.5,
            ammo: 6
        },
        updates: []
    }
})