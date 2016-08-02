module.exports = Player

function Player(level) {
    this.Level            = level;
    this.HomeBase         = null;
    this.Buildings        = [];
    this.Color            = 0x88FF88;
    this.BuildingCounts   = {};
    this.Resources        = {
        Energy: 0,
        Metal:  0,
        Ammo:   0
    };
    this.ResourceStorage  = {
        Energy: 0,
        Metal:  0,
        Ammo:   0
    };
    this.AddBuildingCount = function (constructor) {
        this.BuildingCounts[constructor] = (this.BuildingCounts[constructor] || 0) + 1;
    };
    this.GetBuildingCount = function (constructor) {
        return this.BuildingCounts[constructor] || 0;
    };
    /** @returns bool **/
    this.TryApplyCost = function (costs) {
        if (costs == null) return false;
        var costList = {};
        for (var cost in costs) {
            if (costs.hasOwnProperty(cost)) {
                if (typeof(costs[cost]) == 'function')
                    costList[cost] = costs[cost](this);
                else
                    costList[cost] = costs[cost];
                if (this.Resources[cost] < costList[cost]) return false;
            }
        }
        for (cost in costs) {
            if (costs.hasOwnProperty(cost)) {
                this.Resources[cost] -= costList[cost];
            }
        }
        return true;
    };
    /** @returns bool **/
    this.TestApplyCost = function (costs) {
        if (costs == null) return false;
        var costList = {};
        for (var cost in costs) {
            if (costs.hasOwnProperty(cost)) {
                if (typeof(costs[cost]) == 'function')
                    costList[cost] = costs[cost](this);
                else
                    costList[cost] = costs[cost];
                if (this.Resources[cost] < costList[cost]) return false;
            }
        }
        return true;
    };

    this.Score    = 0;
    this.AddScore = function (score) {
        this.Score += score;
    };

    this.CheckResourceStorageLimit = function () {
        for (var key in this.ResourceStorage) {
            if (this.ResourceStorage.hasOwnProperty(key)
                && this.Resources[key] > this.ResourceStorage[key]) {
                this.Resources[key] = this.ResourceStorage[key];
            }
        }
    };
    this.update                    = function () {
        this.CheckResourceStorageLimit();
    }
}
