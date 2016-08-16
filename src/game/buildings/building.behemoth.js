var loader  = require("./building.loader")
var Images  = require("../../img")
var Weapons = require("../Weapons")

module.exports = loader({
    name:        'Behemoth',
    constructor: {
        Cost: {
            Energy: 50,
            Metal:  40
        }
    },
    getSprite:   Images.Buildings.LargePlatform,
    template:    {
        Health:  5,
        Weapons: [
            Weapons.Gun({
                range:           300,
                fireRate:        60,
                damage:          20,
                projectileSpeed: 6,
                shotsPerShot:    1,
                accuracy:        .98
            })
        ]
    }
})