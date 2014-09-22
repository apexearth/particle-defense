define("game/Unit", ["util/General", "game/Settings"], function (General, Settings) {
    function Unit(level, templates) {
        this.X = 0;
        this.Y = 0;
        this.VelocityX = 0;
        this.VelocityY = 0;
        this.Radius = 3;
        this.MoveSpeed = 1;
        this.Health = 10;
        this.Level = level;
        this.Destination = null;
        this.Path = null;
        this.Score = 0;
        this.IsDead = false;

        this.UpdateBlockLocation = function () {
            var _blockX = this.BlockX;
            var _blockY = this.BlockY;
            this.BlockX = Math.floor(this.X / Settings.BlockSize);
            this.BlockY = Math.floor(this.Y / Settings.BlockSize);
            if (_blockX !== this.BlockX || _blockY !== this.BlockY) {
                if (_blockX !== undefined && _blockY !== undefined) {
                    level.getBlock(_blockX, _blockY).Remove(this);
                }
                level.getBlock(this.BlockX, this.BlockY).Add(this);
            }
        };
        this.UpdateBlockLocation();

        this.hitTest = function (other) {
            return General.Distance(this.X - other.X, this.Y - other.Y) < this.Radius + other.Radius;
        };
        this.hitTestLine = function (start, finish, width) {
            if (width === undefined) width = 1;
            var area2 = Math.abs((finish.X - start.X) * (this.Y - start.Y) - (this.X - start.X) * (finish.Y - start.Y));
            var lab = Math.sqrt(Math.pow(finish.X - start.X, 2) + Math.pow(finish.Y - start.Y, 2));
            var h = area2 / lab;
            return h < this.Radius
                && this.X >= Math.min(start.X, finish.X) - this.Radius - width && this.X <= Math.max(start.X, finish.X) + this.Radius + width
                && this.Y >= Math.min(start.Y, finish.Y) - this.Radius - width && this.Y <= Math.max(start.Y, finish.Y) + this.Radius + width;
        };
        this.move = function () {
            if (this.Path == null || this.Path.length == 0) {
                this.VelocityX = 0;
                this.VelocityY = 0;
                return;
            }
            var moveTarget = this.Path[0];
            var moveAmount = General.normalize(this.X, this.Y, moveTarget.X, moveTarget.Y);
            moveAmount.X *= this.MoveSpeed;
            moveAmount.Y *= this.MoveSpeed;

            this.VelocityX = moveAmount.X;
            this.VelocityY = moveAmount.Y;

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
            if (this.Score === 0) this.calculateScore();

            this.move();
            this.UpdateBlockLocation();

            // Check if reached the target
            if (this.Destination != null
                && this.BlockX == this.Destination.BlockX
                && this.BlockY == this.Destination.BlockY) {
                this.Destination.Health--;
                this.die();
            }
        };
        this.die = function () {
            this.IsDead = true;
            var i = this.Level.Units.indexOf(this);
            if (i !== -1) this.Level.Units.splice(i, 1);
            level.getBlock(this.BlockX, this.BlockY).Remove(this);
            this.Level.Player.Score += this.Score;
        };
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
            this.Path = this.Level.getPathForUnit(this);
        };
        this.calculateScore = function () {
            this.Score = this.Health * this.MoveSpeed;
        };
        this.loadTemplate = function (template) {
            General.CopyTo(template, this);
        };
        this.loadTemplates = function () {
            if (templates === undefined)return;
            if (templates instanceof Array)
                for (var template in templates) {
                    if (templates.hasOwnProperty(template))
                        this.loadTemplate(templates[template]);
                }
            else
                this.loadTemplate(templates);
        };
        this.initialize = function () {
            this.UpdateBlockLocation();
            this.calculateScore();
        };

        this.loadTemplates();
        this.initialize();
    }

    return Unit;
});