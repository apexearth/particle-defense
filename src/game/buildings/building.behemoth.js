var loader = require('./building.loader');
var Images = require('../../img');
var Weapons = require('../Weapons');

module.exports = loader({
    name:        'Behemoth',
    constructor: {
        cost: {
            energy: 50,
            metal: 40
        }
    },
    getSprite: Images.buildings.LargePlatform,
    template:    {
        health: 5,
        Weapons: [
            Weapons.Gun({
                range:           300,
                fireRate:        60,
                damage:          20,
                projectileSpeed: 6,
                shotsPerShot:    1,
                accuracy:        .98
            })
        ]
    }
});