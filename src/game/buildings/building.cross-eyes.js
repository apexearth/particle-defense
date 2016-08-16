var loader  = require("./building.loader")
var Images  = require("../../img")
var Weapons = require("../Weapons")

module.exports = loader({
    name:        'CrossEyes',
    constructor: {
        Cost: {
            Energy: 35,
            Metal:  20
        }
    },
    getSprite:   Images.Buildings.Platform,
    template:    {
        Health:  5,
        Weapons: [
            Weapons.Gun({
                range:           150,
                fireRate:        13,
                damage:          8,
                projectileSpeed: 6,
                shotsPerShot:    2,
                accuracy:        .9
            })
        ]
    }
})