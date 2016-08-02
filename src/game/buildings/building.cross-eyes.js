var loader   = require("./building.loader")
var Images   = require("../../img")
var Weapons = require("../Weapons")

module.exports = loader({
        name: 'CrossEyes',
        constructor: {
            Cost: {
                Energy: 35,
                Metal: 20
            }
        },
        getSprite: Images.Buildings.Platform,
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(100, 15, 2.5, .5, .85, 3)]
        }
    })