var loader = require('./building.loader')
var Images = require('../../img')
var Weapons = require('../Weapons')

module.exports = loader({
    name:        'Cannon',
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
            Weapons.Cannon({
                range:                100,
                fireRate:             30,
                damage:               3,
                projectileSpeed:      2.5,
                shotsPerShot:         1,
                accuracy:             .95,
                explosiveSpeed:       .35,
                explosiveTime:        1,
                explosiveInitialSize: 5
            })
        ]
    }
})