var Weapons = require('../weapons');
var Images = require('../../img');
var Building = require('./building');

module.exports = LethargicCannon;

function LethargicCannon(options) {
    Building.call(this, options);
    this.name = 'LethargicCannon';
    this.container.addChild(Images.buildings.LargePlatform());
    this.health = 5;
    this.addWeapon(new Weapons.Cannon(85, 30, 1.75, 1.75, .95, 1, .15, 4, 7));
}

LethargicCannon.prototype = Object.create(Building.prototype);
LethargicCannon.prototype.constructor = LethargicCannon;

LethargicCannon.cost = {
    energy: 60,
    metal: 30
};
