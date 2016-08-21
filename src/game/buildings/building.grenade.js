var loader = require('./building.loader')
var Images = require('../../img')
var Weapons = require('../Weapons')

module.exports = loader({
    name: 'GrenadeLauncher',
    constructor: {
        cost: {
            energy: 60,
            metal: 30
        }
    },
    getSprite: Images.buildings.Platform,
    template: {
        health: 5,
        Weapons: [Weapons.GrenadeLauncher(100, 30, 3, 2, 1, .95, 1, .35, 1, 5)]
    }
})
    