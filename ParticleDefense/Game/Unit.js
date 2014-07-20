///<reference path="~/util/General.js" />
///<reference path="~/Game/Map.js" />
///<reference path="~/Game/Level.js" />
///<reference path="~/util/Pathfind.js" />
function Unit(level, x, y) {
    this.X = (x == null ? 0 : x);
    this.Y = (y == null ? 0 : y);
    this.Radius = 3;
    this.MoveSpeed = 1;
    this.Health = 10;
    this.Level = level;
    this.Destination = null;
    this.Path = null;
}

Unit.prototype.hitTest = function (other) {
    return General.Distance(this.X - other.X, this.Y - other.Y) < this.Radius + other.Radius;
};
Unit.prototype.BlockX = function () {
    return Math.floor(this.X / Level.Settings.BlockSize);
};
Unit.prototype.BlockY = function () {
    return Math.floor(this.Y / Level.Settings.BlockSize);
};
Unit.prototype.move = function () {
    if (this.Path == null || this.Path.length == 0) return;
    var moveTarget = this.Path[0];
    var moveAmount = General.normalize(this.X, this.Y, moveTarget.X, moveTarget.Y);
    moveAmount.X *= this.MoveSpeed;
    moveAmount.Y *= this.MoveSpeed;

    if (Math.abs(this.X - moveTarget.X) > Math.abs(moveAmount.X))
        this.X += moveAmount.X;
    else
        this.X = moveTarget.X;

    if (Math.abs(this.Y - moveTarget.Y) > Math.abs(moveAmount.Y))
        this.Y += moveAmount.Y;
    else
        this.Y = moveTarget.Y;

    if (this.X == moveTarget.X && this.Y == moveTarget.Y)
        this.Path.splice(0, 1);
};
Unit.prototype.damage = function (amount) {
    this.Health -= amount;
};
Unit.prototype.update = function () {
    if (this.Health <= 0) {
        var i = this.Level.Units.indexOf(this);
        if (i !== -1) this.Level.Units.splice(i, 1);
    }
    this.move();

    // Check if reached the target
    if (this.Destination != null
        && this.BlockX() == this.Destination.BlockX
        && this.BlockY() == this.Destination.BlockY) {
        this.Destination.Health--;
        this.Level.Units.splice(this.Level.Units.indexOf(this), 1);
    }

};
Unit.prototype.draw = function (context) {
    context.strokeStyle = '#fff';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(this.X, this.Y, this.Radius, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();
};
Unit.prototype.setDestination = function (target) {
    this.Destination = target;
    this.Path = this.Level.getPath(this);
};