var loader   = require("./building.loader")
var Images   = require("../../img")

module.exports = loader({
    name:        'Wall',
    constructor: {
        Cost: {
            Energy: 4,
            Metal:  2
        }
    },
    getSprite:   Images.Buildings.SmallPlatform,
    template:    {
        Health: 20
    }
})
