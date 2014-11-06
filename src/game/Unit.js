define("game/Unit", ["./PIXI", "../util/General", "./Settings"], function (PIXI, General, Settings) {
    function Unit(level, templates) {
        this.position.x = 0;
        this.position.y = 0;
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
            this.BlockX = Math.floor(this.position.x / Settings.BlockSize);
            this.BlockY = Math.floor(this.position.y / Settings.BlockSize);
            if (_blockX !== this.BlockX || _blockY !== this.BlockY) {
                if (_blockX !== undefined && _blockY !== undefined) {
                    level.getBlock(_blockX, _blockY).Remove(this);
                }
                level.getBlock(this.BlockX, this.BlockY).Add(this);
            }
        };

        this.UpdateBlockLocation();

        this.hitTest = function (point, radius) {
            return General.Distance(this.position.x - point.x, this.position.y - point.y) < this.Radius + radius;
        };
        this.hitTestLine = function (start, finish, width) {
            if (width === undefined) width = 1;
            var area2 = Math.abs((finish.x - start.x) * (this.position.y - start.y) - (this.position.x - start.x) * (finish.y - start.y));
            var lab = Math.sqrt(Math.pow(finish.x - start.x, 2) + Math.pow(finish.y - start.y, 2));
            var h = area2 / lab;
            return h < this.Radius
                && this.position.x >= Math.min(start.x, finish.x) - this.Radius - width && this.position.x <= Math.max(start.x, finish.x) + this.Radius + width
                && this.position.y >= Math.min(start.y, finish.y) - this.Radius - width && this.position.y <= Math.max(start.y, finish.y) + this.Radius + width;
        };
        this.move = function () {
            if (this.Path == null || this.Path.length == 0) {
                this.VelocityX = 0;
                this.VelocityY = 0;
                return;
            }
            var moveTarget = this.Path[0];
            var moveAmount = General.normalize(this.position.x, this.position.y, moveTarget.x, moveTarget.y);
            moveAmount.x *= this.MoveSpeed;
            moveAmount.y *= this.MoveSpeed;

            this.VelocityX = moveAmount.x;
            this.VelocityY = moveAmount.y;

            if (Math.abs(this.position.x - moveTarget.x) > Math.abs(moveAmount.x))
                this.position.x += moveAmount.x;
            else
                this.position.x = moveTarget.x;

            if (Math.abs(this.position.y - moveTarget.y) > Math.abs(moveAmount.y))
                this.position.y += moveAmount.y;
            else
                this.position.y = moveTarget.y;

            if (this.position.x == moveTarget.x && this.position.y == moveTarget.y)
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
            level.removeChild(this);
            this.Level.Player.Score += this.Score;
        };
        this.draw = function (context) {
            context.strokeStyle = '#fff';
            context.lineWidth = 2;
            context.beginPath();
            context.arc(this.position.x, this.position.y, this.Radius, 0, 2 * Math.PI);
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
            General.NestedCopyTo(template, this);
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

    return function (level, canvas, template) {
        var unit = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
        unit.anchor.x = .5;
        unit.anchor.y = .5;
        level.addChild(unit);

        Unit.call(unit, level, template);
        unit.scale.x = (unit.Radius * 2) / unit.width;
        unit.scale.y = (unit.Radius * 2) / unit.height;
        return unit;
    };
});