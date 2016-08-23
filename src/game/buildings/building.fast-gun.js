var loader = require('./building.loader');
var Images = require('../../img');
var Weapons = require('../Weapons');

module.exports = loader({
    name: 'FastGun',
    constructor: {
        cost: {
            energy: 30,
            metal: 15
        }
    },
    getSprite: Images.buildings.Platform,
    template: {
        health: 5,
        weapons: [
            Weapons.Gun({
                range: 100,
                fireRate: 10,
                damage: 3,
                projectileSpeed: 6,
                shotsPerShot: 1,
                accuracy: .94
            })
        ]
    }
});
