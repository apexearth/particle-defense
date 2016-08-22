var loader = require('./building.loader');
var Images = require('../../img');
var Weapons = require('../Weapons');

module.exports = loader({
    name:        'SharpShooter',
    constructor: {
        cost: {
            energy: 40,
            metal: 20
        }
    },
    getSprite: Images.buildings.LargePlatform,
    template:    {
        health: 5,
        Weapons: [
            Weapons.Gun({
                range:           200,
                fireRate:        30,
                damage:          20,
                projectileSpeed: 60,
                shotsPerShot:    1,
                accuracy:        .995
            })
        ]
    }
});
