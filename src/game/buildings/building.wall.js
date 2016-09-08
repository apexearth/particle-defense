var Images = require('../../img');
var Building = require('./Building');

module.exports = Wall;

function Wall(options) {
    Building.call(this, options);
    this.name = 'Wall';
    this.container.addChild(Images.buildings.SmallPlatform());
    this.health = 20;
}

Wall.prototype = Object.create(Building.prototype);
Wall.prototype.constructor = Wall;

Wall.cost = {
    energy: 4,
    metal: 2
};

Wall.tags = [
    'defense',
    'wall'
];

