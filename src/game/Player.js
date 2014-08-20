define("game/Player", function () {
    function Player(level) {
        this.Level = level;
        this.HomeBase = null;
        this.Buildings = [];
        this.Resources = {
            Energy: 0,
            Metal: 0,
            Ammo: 0
        };
        this.ResourceStorage = {
            Energy: 0,
            Metal: 0,
            Ammo: 0
        }
        this.Score = 0;
        this.AddScore = function (score) {
            this.Score += score;
        }

        this.update = function () {
            for (var key in this.ResourceStorage) {
                if (this.ResourceStorage.hasOwnProperty(key)
                    && this.Resources[key] > this.ResourceStorage[key]) {
                    this.Resources[key] = this.ResourceStorage[key];
                }
            }
        }
    }
    return Player;
});