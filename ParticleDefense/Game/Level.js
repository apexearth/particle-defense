/// <reference path="~/Util/Grid.js" />
/// <reference path="~/Game/Map.js" />
/// <reference path="~/util/Pathfind.js" />
/// <reference path="~/Game/Unit.js" />
/// <reference path="~/Game/Buildings/HomeBase.js" />
function Level(width, height) {
    var me = this;
    this.Map = new Map(width, height);

    this.Width = this.Map.PixelWidth;
    this.Height = this.Map.PixelHeight;

    this.Player = null;
    this.Players = [];

    this.Units = [];
    this.Projectiles = [];
    this.Buildings = [];
    this.Waves = [];
    this.CurrentWave = null;
    this.WaveDelay = 30;
    this.WaveDelayCount = 0;
    this.WinConditions = [function () {
        return (me.CurrentWave === null || me.CurrentWave.Units.length === 0)
            && me.Waves.length === 0
            && me.Units.length === 0;
    }];
    this.LossConditions = [function () {
        return me.Player.Buildings.length == 0;
    }];
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.Map.PixelWidth;
    this.canvas.height = this.Map.PixelHeight;
    this.context = this.canvas.getContext("2d");

    this.AddBuilding = function (building) {
        this.Buildings.push(building);
        building.Player.Buildings.push(building);
        return building;
    };
    this.AddPlayer = function (player) {
        this.Players.push(player);
        return player;
    };
    this.createWave = function (unitArray, unitDelay) {
        var wave = {
            Units: unitArray,
            UnitDelay: unitDelay,
            UnitDelayCount: 0
        };
        this.Waves.push(wave);
        return wave;
    };
}

Level.Settings = {
    BlockSize: 50
};



Level.prototype.update = function () {
    if (this.Units.length === 0
        && (this.CurrentWave === null || this.CurrentWave.Units.length === 0)
        && this.Waves.length !== 0
        && this.WaveDelayCount++ >= this.WaveDelay) {
        this.CurrentWave = this.Waves.pop();
        this.WaveDelayCount = 0;
    }
    var unit;
    if (this.CurrentWave !== null
        && this.CurrentWave.Units.length > 0
        && this.CurrentWave.UnitDelayCount++ >= this.CurrentWave.UnitDelay) {
        unit = this.CurrentWave.Units.pop();
        this.Units.push(unit);
        if (this.Player.HomeBase.Health > 0)
            unit.setDestination(this.Player.HomeBase);
        this.CurrentWave.UnitDelayCount = 0;
    }

    var u = this.Units.length;
    while (u-- > 0) {
        unit = this.Units[u];
        unit.update();
    }

    var b = this.Buildings.length;
    while (b-- > 0) {
        var building = this.Buildings[b];
        building.update();
    }

    var p = this.Projectiles.length;
    while (p-- > 0) {
        var projectile = this.Projectiles[p];
        projectile.update();
    }

};

Level.prototype.draw = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var b = this.Buildings.length;
    while (b--)
        this.Buildings[b].draw(this.context);

    var u = this.Units.length;
    while (u--)
        this.Units[u].draw(this.context);

    var p = this.Projectiles.length;
    while (p-- > 0) {
        var projectile = this.Projectiles[p];
        projectile.draw(this.context);
    }
    this.context.drawImage(this.Map.canvas, 0, 0);
};


Level.prototype.getPath = function (unit) {
    return this.Map.getPathByBlock(
        this.Map.getBlock(unit.X, unit.Y),
        this.Map.getBlockFromVector(unit.Destination)
    );
};

Level.prototype.checkWinConditions = function () {
    var i = this.WinConditions.length;
    while (i--) if (!this.WinConditions[i]()) return false;
    return true;
};

Level.prototype.checkLossConditions = function () {
    var i = this.LossConditions.length;
    while (i--) if (!this.LossConditions[i]()) return false;
    return true;
};

