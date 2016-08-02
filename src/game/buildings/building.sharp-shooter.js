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
        Weapons: [Weapons.Gun(150, 20, 7, 3, .97, 1)]
    }
})
