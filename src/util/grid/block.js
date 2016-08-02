var BlockStatus = require("./block-status")

module.exports = Block

function Block(x, y) {
    var _status   = BlockStatus.IsNothing;
    var _building = null;
    this.x        = x;
    this.y        = y;
    this.Objects  = [];

    this.SetStatus = function (status) {
        _status = status;
    };
    /** @return String **/
    this.Status = function () {
        if (_status !== null) return _status;
        return null;
    };
    this.RemoveBuilding = function () {
        _status   = BlockStatus.IsEmpty;
        _building = null;
    };
    this.SetBuilding    = function (building) {
        _status   = BlockStatus.NotBuildable;
        _building = building;
    };
    this.GetBuilding    = function () {
        return _building;
    };
    this.Add            = function (object) {
        this.Objects.push(object);
    };
    this.Remove         = function (object) {
        this.Objects.splice(this.Objects.indexOf(object), 1);
    };
}
