var loader   = require("./building.loader")
var Images   = require("../../img")
var Weapons  = require("../Weapons")

module.exports = loader({
    name:        'SharpShooter',
    constructor: {
        Cost: {
            Energy: 40,
            Metal:  20
        }
    },
    getSprite:   Images.Buildings.LargePlatform,
    template:    {
        Health:  5,
        Weapons: [
            Weapons.Gun({
                range:           200,
                fireRate:        30,
                damage:          20,
                projectileSpeed: 60,
                shotsPerShot:    1,
                accuracy:        .995
            })
        ]
    }
})
