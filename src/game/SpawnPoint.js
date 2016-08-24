var PIXI = require('pixi.js');
var Units = require('./units');
var Settings = require('./Settings');

module.exports = function (level, template) {
    var spawnPoint = new PIXI.Container();
    SpawnPoint.call(spawnPoint, level, template);
    return spawnPoint;
};

function SpawnPoint(level, template) {
    PIXI.Container.call(this);
    level.container.addChild(this);

    var graphics = new PIXI.Graphics();
    this.addChild(graphics);
    graphics.beginFill(0x660000, 1);
    graphics.drawRect(0, 0, Settings.BlockSize, Settings.BlockSize);
    
    this.level = level;
    this.position.x = template.x * Settings.BlockSize;
    this.position.y = template.y * Settings.BlockSize;
    this.blockX = template.x;
    this.blockY = template.y;
    
    this.currentWave = null;
    this.waves = [];
    this.createWave = function (waveDelay, spawnInterval, units) {
        this.waves.unshift({
            units: units,
            spawnInterval: spawnInterval,
            spawnIntervalCount: 0,
            waveDelay: waveDelay,
            waveDelayCount: 0
        });
    };
    /** @returns bool **/
    this.hasWaves = function () {
        return this.currentWave !== null
            || this.waves.length !== 0;
    };
    this.update = function (level) {
        if (level.units.length === 0
            && (this.currentWave === null || this.currentWave.units.length === 0)
            && this.waves.length !== 0) {
            this.currentWave = this.waves.pop();
            this.currentWave.WaveDelayCount = 0;
        }
        var unit;
        if (this.currentWave !== null
            && this.currentWave.WaveDelayCount++ >= this.currentWave.WaveDelay
            && this.currentWave.units.length > 0
            && this.currentWave.SpawnIntervalCount++ >= this.currentWave.SpawnInterval) {
            unit = this.currentWave.units.pop();
        
            level.units.push(unit);
            unit.visible = true;
            if (level.player.homeBase.health > 0)
                unit.setDestination(level.player.homeBase);
            this.currentWave.SpawnIntervalCount = 0;
        } else if (this.currentWave !== null
            && this.currentWave.units.length === 0) {
            this.currentWave = null;
        }
    };

    var me = this;
    for (var _w in template.waves) {
        var w = template.waves[_w];
        var wave = Units.Array(function () {
            if (w.unitType !== undefined) {
                var unit = new Units[w.unitType](level);
                unit.visible = false;
                if (w.Template !== undefined) unit.loadTemplate(w.Template);
                if (w.Customization !== undefined) unit.loadTemplate(w.Customization);
                unit.position.x = me.blockX * Settings.BlockSize + Settings.BlockSize / 2;
                unit.position.y = me.blockY * Settings.BlockSize + Settings.BlockSize / 2;
                unit.initialize();
                return unit;
            } else throw new Error('A wave must have a unit template.');
        }, w.Count);
        this.createWave(w.WaveDelay, w.SpawnInterval, wave);
    }
}
