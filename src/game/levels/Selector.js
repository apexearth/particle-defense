var collision = require('geom-collision');
module.exports = Selector;

function Selector() {
    this.selection = [];
    var start = null;
    var finish = null;
    Object.defineProperties(this, {
        bounds: {
            get: function () {
                if (!this.start) return null;
                return {
                    top: start.y,
                    left: start.x,
                    bottom: finish.y,
                    right: finish.x
                };
            }.bind(this)
        }
    });

    this.start = function (position) {
        this.selection = [];
        start = {
            x: position.x,
            y: position.y
        };
        finish = {
            x: position.x + 1,
            y: position.y + 1
        };
    };
    this.move = function (position) {
        finish = {
            x: position.x,
            y: position.y
        };
    };
    this.finish = function (position, selectables) {
        this.move(position);
        this.checkSelection(selectables);
    };
    this.checkSelection = function (selectables) {
        this.selection = [];
        for (var i in selectables) {
            var selectable = selectables[i];
            var coll = collision.rectangleCircleSimple(start, finish, selectable.position, selectable.radius || 0);
            if (coll.result !== 'outside') {
                this.selection.push(selectable);
            }
        }
    };
}