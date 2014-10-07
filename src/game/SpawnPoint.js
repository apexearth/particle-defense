define('game/SpawnPoint', ["game/Units", "game/Unit", "game/Settings"], function (Units, Unit, Settings) {

    return function (level, template) {
        this.Level = level;
        this.X = template.X;
        this.Y = template.Y;
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
                var unit = new Unit(level);
                if (w.TemplateName !== undefined) unit.loadTemplate(Units[w.TemplateName]);
                if (w.Template !== undefined) unit.loadTemplate(w.Template);
                if (w.Customization !== undefined) unit.loadTemplate(w.Customization);
                unit.X = me.X * Settings.BlockSize + Settings.BlockSize / 2;
                unit.Y = me.Y * Settings.BlockSize + Settings.BlockSize / 2;
                unit.initialize();
                return unit;
            }, w.Count);
            this.CreateWave(w.WaveDelay, w.SpawnInterval, wave);
        }

    };

});