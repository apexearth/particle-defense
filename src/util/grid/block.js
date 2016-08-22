var BlockStatus = require('./block-status');

module.exports = Block;

function Block(x, y) {
    var _status = BlockStatus.IsNothing;
    var _building = null;
    this.x = x;
    this.y = y;
    this.objects = [];

    Object.defineProperties(this, {
        status: {
            get: function () {
                return _status;
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
    this.GetBuilding = function () {
        return _building;
    };
    this.Add = function (object) {
        this.objects.push(object);
    };
    this.Remove = function (object) {
        this.objects.splice(this.objects.indexOf(object), 1);
    };
}
