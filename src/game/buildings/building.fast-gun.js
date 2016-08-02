var loader   = require("./building.loader")
var Images   = require("../../img")
var Weapons = require("../Weapons")

module.exports = loader({
        name: 'FastGun',
        constructor: {
            Cost: {
                Energy: 30,
                Metal: 15
            }
        },
        getSprite: Images.Buildings.Platform,
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(75, 25, 5, 1, .96, 1)]
        }
    })
