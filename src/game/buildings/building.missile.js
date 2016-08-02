var loader   = require("./building.loader")
var Images   = require("../../img")
var Weapons  = require("../Weapons")

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
        Weapons: [Weapons.Missile(150, 45, 2, .1, 1, .95, .5, 1, 8)]
    }
})
