var loader = require('./building.loader')
var Images = require('../../img')
var Weapons = require('../Weapons')

module.exports = loader({
    name: 'Laser',
    constructor: {
        cost: {
            energy: 50,
            metal: 25
        }
    },
    getSprite: Images.buildings.Platform,
    template: {
        health: 5,
        Weapons: [
            Weapons.Laser({
                range: 100,
                lifeSpan: 60,
                damage: 4,
                fireRate: 45,
                accuracy: .95
            })
        ]
    }
})
