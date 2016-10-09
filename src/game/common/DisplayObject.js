var PIXI = require('pixi.js');

module.exports = DisplayObject;

function DisplayObject(options) {
    if (!options.level) throw new Error('A level is required to create a unit.');
    this.level = options.level;
    this.container = new PIXI.Container();

    Object.defineProperties(this, {
        position: {
            get: function () {
                return this.container.position;
            }.bind(this)
        }
    });
}
