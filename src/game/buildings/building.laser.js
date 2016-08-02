var loader   = require("./building.loader")
var Images   = require("../../img")
var Weapons = require("../Weapons")

module.exports = loader({
        name: 'Laser',
        constructor: {
            Cost: {
                Energy: 50,
                Metal: 25
            }
        },
        getSprite: Images.Buildings.Platform,
        template: {
            Health: 5,
            Weapons: [Weapons.Laser(100, 60, 45, 4, .95)]
        }
    })
