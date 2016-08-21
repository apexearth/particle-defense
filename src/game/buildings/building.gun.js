var loader = require('./building.loader')
var Images = require('../../img')
var Weapons = require('../Weapons')

module.exports = loader({
    name:        'Gun',
    constructor: {
        cost: {
            energy: 20,
            metal: 10
        }
    },
    getSprite: Images.buildings.SmallPlatform,
    template:    {
        health: 5,
        Weapons: [
            Weapons.Gun({
                range:           150,
                fireRate:        20,
                damage:          5,
                projectileSpeed: 6,
                shotsPerShot:    1,
                accuracy:        .94
            })
        ]
    }
})
