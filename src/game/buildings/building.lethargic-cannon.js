var loader = require('./building.loader');
var Images = require('../../img');
var Weapons = require('../Weapons');

module.exports = loader({
    name:        'LethargicCannon',
    constructor: {
        cost: {
            energy: 60,
            metal: 30
        }
    },
    getSprite: Images.buildings.LargePlatform,
    template:    {
        health: 5,
        weapons: [Weapons.Cannon(85, 30, 1.75, 1.75, .95, 1, .15, 4, 7)]
    }
});
