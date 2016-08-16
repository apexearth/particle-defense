var loader   = require("./building.loader")
var color    = require("color")
var Images   = require("../../img")
var Settings = require("../Settings")
var Weapons = require("../Weapons")

module.exports = loader({
        name: 'MachineGun',
        constructor: {
            Cost: {
                Energy: 45,
                Metal: 20
            }
        },
        getSprite: Images.Buildings.LargePlatform,
        template: {
            Health: 5,
            Weapons: [
                Weapons.Gun({
                    range:           100,
                    fireRate:        5,
                    damage:          2,
                    projectileSpeed: 6,
                    shotsPerShot:    1,
                    accuracy:        .9
                })
            ]
        }
    })