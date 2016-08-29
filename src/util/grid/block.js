var BlockStatus = require('./block-status');

module.exports = Block;

function Block(x, y) {
    var _status = BlockStatus.IsEmpty;
    var _building = null;
    this.objects = [];

    Object.defineProperties(this, {
        x: {
            get: function () {
                return x;
            }
        },
        y: {
            get: function () {
                return y;
            }
        },
        status: {
            get: function () {
                return _status;
            },
            set: function (value) {
                _status = value;
            }
        },
        building: {
            get: function () {
                return _building;
            },
            set: function (val) {
                if (val === null) {
                    _status = BlockStatus.IsEmpty;
                    _building = null;
                }
                else {
                    _status = BlockStatus.NotBuildable;
                    _building = val;
                }
            }
        }
    });
    this.add = function (object) {
        this.objects.push(object);
    };
    this.remove = function (object) {
        var index = this.objects.indexOf(object);
        if (index >= 0) {
            this.objects.splice(index, 1);
        }
    };
    this.contains = function (object) {
        return this.building === object
            || this.objects.indexOf(object) >= 0;
    };
    this.toString = function () {
        return 'Block(' + this.x + ',' + this.y + ')';
    };
}
