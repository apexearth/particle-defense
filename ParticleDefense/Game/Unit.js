///<reference path="~/Game/Level.js" />
///<reference path="~/util/General.js" />
///<reference path="~/Game/Map.js" />
///<reference path="~/util/Pathfind.js" />
function Unit(level, x, y) {
    this.X = (x == null ? 0 : x);
    this.Y = (y == null ? 0 : y);
    this.VelocityX = 0;
    this.VelocityY = 0;
    this.Radius = 3;
    this.MoveSpeed = 1;
    this.Health = 10;
    this.Level = level;
    this.Destination = null;
    this.Path = null;
    this.Score = 0;

    this.UpdateBlockLocation = function () {
        this.BlockX = Math.floor(this.X / Level.Settings.BlockSize);
        this.BlockY = Math.floor(this.Y / Level.Settings.BlockSize);
    }
    this.UpdateBlockLocation();

    this.hitTest = function (other) {
        return General.Distance(this.X - other.X, this.Y - other.Y) < this.Radius + other.Radius;
    };
    this.move = function () {
        if (this.Path == null || this.Path.length == 0) return;
        var moveTarget = this.Path[0];
        var moveAmount = General.normalize(this.X, this.Y, moveTarget.X, moveTarget.Y);
        moveAmount.X *= this.MoveSpeed;
        moveAmount.Y *= this.MoveSpeed;

        this.VelocityX = Math.abs(moveAmount.X);
        this.VelocityY = Math.abs(moveAmount.Y);

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
    this.damage = function (amount) {
        this.Health -= amount;
        if (this.Health <= 0) this.die();
    };
    this.update = function () {
        this.move();
        this.UpdateBlockLocation();

        // Check if reached the target
        if (this.Destination != null
            && this.BlockX == this.Destination.BlockX
            && this.BlockY == this.Destination.BlockY) {
            this.Destination.Health--;
            this.Health = 0;
            this.Level.Units.splice(this.Level.Units.indexOf(this), 1);
        }

    };
    this.die = function () {
        var i = this.Level.Units.indexOf(this);
        if (i !== -1) this.Level.Units.splice(i, 1);
        this.Level.Player.Score += this.Score;
    }
    this.draw = function (context) {
        context.strokeStyle = '#fff';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.X, this.Y, this.Radius, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
    };
    this.setDestination = function (target) {
        this.Destination = target;
        this.findPath();
    };
    this.findPath = function () {
        this.Path = this.Level.getPath(this);
    }
    this.calculateScore();
}

Unit.prototype.calculateScore = function () {
    this.Score = this.Health * this.MoveSpeed;
};
Unit.Array = function (unitFunction, count) {
    var array = [];
    while (count--) array.push(unitFunction());
    return array;
}
