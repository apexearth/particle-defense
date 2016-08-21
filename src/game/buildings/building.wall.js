var loader = require('./building.loader')
var Images = require('../../img')

module.exports = loader({
    name:        'Wall',
    constructor: {
        cost: {
            energy: 4,
            metal: 2
        }
    },
    getSprite: Images.buildings.SmallPlatform,
    template:    {
        health: 20
    }
})
