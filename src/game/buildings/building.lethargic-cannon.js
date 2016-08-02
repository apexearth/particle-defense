var loader   = require("./building.loader")
var color    = require("color")
var Images   = require("../../img")
var Settings = require("../Settings")
var Weapons  = require("../Weapons")

module.exports = loader({
    name:        'LethargicCannon',
    constructor: {
        Cost: {
            Energy: 60,
            Metal:  30
        }
    },
    getSprite:   Images.Buildings.LargePlatform,
    template:    {
        Health:  5,
        Weapons: [Weapons.Cannon(85, 30, 1.75, 1.75, .95, 1, .15, 4, 7)]
    }
})