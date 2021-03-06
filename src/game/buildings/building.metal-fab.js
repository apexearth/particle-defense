const Images = require('../../img');
const Building = require('./Building');

module.exports = MetalFab;

function MetalFab(options) {
    Building.call(this, options);
    this.name = 'MetalFab';
    this.container.addChild(Images.buildings.MetalFab());
    this.health = 20;
    this.resourceStorage.metal = 50;
    this.addStorageToPlayer();
    this.resourceGeneration.metal = 1.5;
}

MetalFab.prototype = Object.create(Building.prototype);
MetalFab.prototype.constructor = MetalFab;

MetalFab.cost = {
    energy: 50,
    metal: 75
};

MetalFab.tags = [
    'resource',
    'metal'
];

