var loader = require('./building.loader')
var Images = require('../../img')
var Weapons = require('../Weapons')

module.exports = loader({
    name: 'Shocker',
    constructor: {
        cost: {
            energy: 25,
            metal: 20
        }
    },
    getSprite: Images.buildings.LargePlatform,
    template: {
        health: 5,
        Canvas: function (canvas) {
            // nothing yet
        },
        Weapons: [Weapons.Shocker(100, 30, 10, 1)]
    }
})