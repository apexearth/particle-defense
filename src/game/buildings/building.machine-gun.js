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
            Weapons: [Weapons.Gun(100, 5, 2.5, 1.25, .9, 2)]
        }
    })