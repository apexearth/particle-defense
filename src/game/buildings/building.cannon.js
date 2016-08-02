var loader   = require("./building.loader")
var Images   = require("../../img")
var Weapons = require("../Weapons")

module.exports = loader({
    name:        'Cannon',
    constructor: {
        Cost: {
            Energy: 60,
            Metal:  30
        }
    },
    getSprite:   Images.Buildings.LargePlatform,
    template:    {
        Health:  5,
        Weapons: [Weapons.Cannon(100, 30, 3, 1.5, .95, 1, .35, 1, 5)]
    }
})