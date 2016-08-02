var PIXI     = require("pixi.js")
var Units    = require("./units")
var Settings = require("./Settings")

module.exports = function (level, template) {
    var spawnPoint = new PIXI.Container();
    level.addChild(spawnPoint);
    SpawnPoint.call(spawnPoint, level, template);
    return spawnPoint;
}

function SpawnPoint(level, template) {
    PIXI.Container.call(this);
    level.addChild(this);

    var graphics = new PIXI.Graphics();
    this.addChild(graphics);
    graphics.beginFill(0x660000, 1);
    graphics.drawRect(0, 0, Settings.BlockSize, Settings.BlockSize);

    this.Level      = level;
    this.position.x = template.x * Settings.BlockSize;
    this.position.y = template.y * Settings.BlockSize;
    this.BlockX     = template.x;
    this.BlockY     = template.y;

    this.CurrentWave = null;
    this.Waves       = [];
    this.CreateWave  = function (waveDelay, spawnInterval, units) {
        this.Waves.unshift({
            Units:              units,
            SpawnInterval:      spawnInterval,
            SpawnIntervalCount: 0,
            WaveDelay:          waveDelay,
            WaveDelayCount:     0
        });
    };
    /** @returns bool **/
    this.HasWaves = function () {
        return this.CurrentWave !== null
            || this.Waves.length !== 0;
    };
    this.update = function (level) {
        if (level.Units.length === 0
            && (this.CurrentWave === null || this.CurrentWave.Units.length === 0)
            && this.Waves.length !== 0) {
            this.CurrentWave                = this.Waves.pop();
            this.CurrentWave.WaveDelayCount = 0;
        }
        var unit;
        if (this.CurrentWave !== null
            && this.CurrentWave.WaveDelayCount++ >= this.CurrentWave.WaveDelay
            && this.CurrentWave.Units.length > 0
            && this.CurrentWave.SpawnIntervalCount++ >= this.CurrentWave.SpawnInterval) {
            unit = this.CurrentWave.Units.pop();

            level.Units.push(unit);
            unit.visible = true;
            if (level.Player.HomeBase.Health > 0)
                unit.setDestination(level.Player.HomeBase);
            this.CurrentWave.SpawnIntervalCount = 0;
        } else if (this.CurrentWave !== null
            && this.CurrentWave.Units.length === 0) {
            this.CurrentWave = null;
        }
    };

    var me = this;
    for (var _w in template.Waves) {
        var w    = template.Waves[_w];
        var wave = Units.Array(function () {
            if (w.UnitType !== undefined) {
                var unit     = new Units[w.UnitType](level);
                unit.visible = false;
                if (w.Template !== undefined) unit.loadTemplate(w.Template);
                if (w.Customization !== undefined) unit.loadTemplate(w.Customization);
                unit.position.x = me.BlockX * Settings.BlockSize + Settings.BlockSize / 2;
                unit.position.y = me.BlockY * Settings.BlockSize + Settings.BlockSize / 2;
                unit.initialize();
                return unit;
            } else throw new Error("A wave must have a unit template.");
        }, w.Count);
        this.CreateWave(w.WaveDelay, w.SpawnInterval, wave);
    }
}
