var collision = require('geom-collision');
module.exports = Selector;

function Selector() {
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
        },
        started: {
            get: function () {
                return start !== null;
            }
        }
    });

    this.start = function (position) {
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
        var selection = this.checkSelection(selectables);
        start = null;
        finish = null;
        return selection;
    };
    this.checkSelection = function (multipleSelectables) {
        if (Object.prototype.toString.call(multipleSelectables[0]) !== '[object Array]') {
            multipleSelectables = [multipleSelectables];
        }
        var selection = [];
        for (var i in multipleSelectables) {
            var selectables = multipleSelectables[i];
            for (var j in selectables) {
                var selectable = selectables[j];
                var coll = collision.pointRectangleSimple(selectable.position, start, finish);
                if (coll.result !== 'outside') {
                    selection.push(selectable);
                }
            }
        }
        return selection;
    };
}