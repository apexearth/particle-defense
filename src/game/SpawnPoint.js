define('game/SpawnPoint', ["./PIXI", "./Units", "./Unit", "./Settings"], function (PIXI, Units, Unit, Settings) {

    function SpawnPoint(level, template) {
        this.Level = level;
        this.x = template.x;
        this.y = template.y;
        this.CurrentWave = null;
        this.Waves = [];
        this.CreateWave = function (waveDelay, spawnInterval, units) {
            this.Waves.unshift({
                Units: units,
                SpawnInterval: spawnInterval,
                SpawnIntervalCount: 0,
                WaveDelay: waveDelay,
                WaveDelayCount: 0
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
                this.CurrentWave = this.Waves.pop();
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
            var w = template.Waves[_w];
            var wave = Units.Array(function () {
                if (w.TemplateName !== undefined) {
                    var unitTemplate = Units[w.TemplateName];
                    var unit = new Unit(level, unitTemplate.getCanvas());
                    unit.visible = false;
                    unit.loadTemplate(unitTemplate);
                    if (w.Template !== undefined) unit.loadTemplate(w.Template);
                    if (w.Customization !== undefined) unit.loadTemplate(w.Customization);
                    unit.position.x = me.x * Settings.BlockSize + Settings.BlockSize / 2;
                    unit.position.y = me.y * Settings.BlockSize + Settings.BlockSize / 2;
                    unit.initialize();
                    return unit;
                } else throw new Error("A wave must have a unit template.");
            }, w.Count);
            this.CreateWave(w.WaveDelay, w.SpawnInterval, wave);
        }
    }

    return function (level, template) {
        var spawnPoint = new PIXI.DisplayObjectContainer();
        level.addChild(spawnPoint);
        SpawnPoint.call(spawnPoint, level, template);
        return spawnPoint;
    };
});