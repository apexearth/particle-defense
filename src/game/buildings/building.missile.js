var loader = require('./building.loader')
var Images = require('../../img')
var Weapons = require('../Weapons')

module.exports = loader({
    name:        'MissileLauncher',
    constructor: {
        cost: {
            energy: 60,
            metal: 30
        }
    },
    getSprite: Images.buildings.LargePlatform,
    template:    {
        health: 5,
        Weapons: [
            Weapons.Missile({
                projectileSpeed:      200,
                explosiveSpeed:       45,
                explosiveTime:        2,
                explosiveInitialSize: .1,
                range:                1,
                damage:               .95,
                fireRate:             .5,
                acceleration:         1,
                accuracy:             8
            })
        ]
    }
})








