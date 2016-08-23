var loader = require('./building.loader');
var Images = require('../../img');
var Weapons = require('../Weapons');

module.exports = loader({
    name:        'CrossEyes',
    constructor: {
        cost: {
            energy: 35,
            metal: 20
        }
    },
    getSprite: Images.buildings.Platform,
    template:    {
        health: 5,
        weapons: [
            Weapons.Gun({
                range:           150,
                fireRate:        13,
                damage:          8,
                projectileSpeed: 6,
                shotsPerShot:    2,
                accuracy:        .9
            })
        ]
    }
});