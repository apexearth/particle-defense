module.exports = Player

function Player(level) {
    this.level = level;
    this.homeBase = null;
    this.buildings = [];
    this.color = 0x88FF88;
    this.buildingCounts = {};
    this.resources = {
        energy: 0,
        metal: 0,
        ammo: 0
    };
    this.resourceStorage = {
        energy: 0,
        metal: 0,
        ammo: 0
    };
    this.addBuildingCost = function (constructor) {
        this.buildingCounts[constructor] = (this.buildingCounts[constructor] || 0) + 1;
    };
    this.getBuildingCount = function (constructor) {
        return this.buildingCounts[constructor] || 0;
    };
    /** @returns bool **/
    this.tryApplyCost = function (costs) {
        if (costs == null) return false;
        var costList = {};
        for (var cost in costs) {
            if (costs.hasOwnProperty(cost)) {
                if (typeof(costs[cost]) == 'function')
                    costList[cost] = costs[cost](this);
                else
                    costList[cost] = costs[cost];
                if (this.resources[cost] < costList[cost]) return false;
            }
        }
        for (cost in costs) {
            if (costs.hasOwnProperty(cost)) {
                this.resources[cost] -= costList[cost];
            }
        }
        return true;
    };
    /** @returns bool **/
    this.testApplyCost = function (costs) {
        if (costs == null) return false;
        var costList = {};
        for (var cost in costs) {
            if (costs.hasOwnProperty(cost)) {
                if (typeof(costs[cost]) == 'function')
                    costList[cost] = costs[cost](this);
                else
                    costList[cost] = costs[cost];
                if (this.resources[cost] < costList[cost]) return false;
            }
        }
        return true;
    };

    this.score = 0;
    this.addScore = function (score) {
        this.score += score;
    };

    this.checkResourceStorageLimit = function () {
        for (var key in this.resourceStorage) {
            if (this.resourceStorage.hasOwnProperty(key)
                && this.resources[key] > this.resourceStorage[key]) {
                this.resources[key] = this.resourceStorage[key];
            }
        }
    };
    this.update                    = function () {
        this.checkResourceStorageLimit();
    }
}
