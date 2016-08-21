var loader = require('./building.loader')
var Images = require('../../img')
var Weapons = require('../Weapons')

module.exports = loader({
    name:        'Beam',
    constructor: {
        cost: {
            energy: 25,
            metal: 20
        }
    },
    getSprite: Images.buildings.SmallPlatform,
    template:    {
        health: 5,
        Weapons: [
            Weapons.Laser({
                range: 100,
                lifeSpan: 1,
                damage: .05,
                fireRate: 3,
                accuracy: .95
            })
        ]
    }
})