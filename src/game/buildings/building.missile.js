var loader  = require("./building.loader")
var Images  = require("../../img")
var Weapons = require("../Weapons")

module.exports = loader({
    name:        'MissileLauncher',
    constructor: {
        Cost: {
            Energy: 60,
            Metal:  30
        }
    },
    getSprite:   Images.Buildings.LargePlatform,
    template:    {
        Health:  5,
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








