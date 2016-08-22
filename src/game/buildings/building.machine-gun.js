var loader = require('./building.loader');
var Images = require('../../img');
var Weapons = require('../Weapons');

module.exports = loader({
    name: 'MachineGun',
    constructor: {
        cost: {
            energy: 45,
            metal: 20
        }
    },
    getSprite: Images.buildings.LargePlatform,
    template: {
        health: 5,
        Weapons: [
            Weapons.Gun({
                range: 100,
                fireRate: 5,
                damage: 2,
                projectileSpeed: 6,
                shotsPerShot: 1,
                accuracy: .9
            })
        ]
    }
});
