var Images = require('../../img');
var Building = require('./Building');

module.exports = AmmoFab;

function AmmoFab(options) {
    Building.call(this, options);
    this.name = 'AmmoFab';
    //this.container.addChild(Images.buildings.AmmoFab());
    this.health = 20;
    this.resourceStorage.ammo = 50;
    this.addStorageToPlayer();
    this.resourceGeneration.ammo = 6;

    this.draw = function () {
        this.graphics.beginFill(0xff9933, .5);
        var padding = 3;
        var spacing = 1;
        var storageCells = 5;
        var totalPadding = padding * 2;
        var totalSpacing = spacing * (storageCells - 1);
        var cellWidth = (this.width - totalPadding - totalSpacing) / storageCells;
        for (var i = 0; i < storageCells; i++) {
            this.graphics.drawRect(
                padding - this.radius + (cellWidth + 1) * i,
                padding - this.radius,
                cellWidth,
                this.radius * 2 - padding * 2
            );
        }
        this.graphics.endFill();
    };
    this.draw();
}

AmmoFab.prototype = Object.create(Building.prototype);
AmmoFab.prototype.constructor = AmmoFab;

AmmoFab.cost = {
    energy: 100,
    metal: 50
};

AmmoFab.tags = [
    'resource',
    'ammo'
];