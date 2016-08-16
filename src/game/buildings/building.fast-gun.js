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
            Weapons: [
                Weapons.Gun({
                    range:           100,
                    fireRate:        10,
                    damage:          3,
                    projectileSpeed: 6,
                    shotsPerShot:    1,
                    accuracy:        .94
                })
            ]
        }
    })
