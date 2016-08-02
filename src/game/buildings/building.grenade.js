var loader   = require("./building.loader")
var Images   = require("../../img")
var Weapons = require("../Weapons")

module.exports =      loader({
        name: 'GrenadeLauncher',
        constructor: {
            Cost: {
                Energy: 60,
                Metal: 30
            }
        },
        getSprite: Images.Buildings.Platform,
        template: {
            Health: 5,
            Weapons: [Weapons.GrenadeLauncher(100, 30, 3, 2, 1, .95, 1, .35, 1, 5)]
        }
    })
    