﻿const actions = require('./actions');

module.exports = Player;

var lastPlayerColor = 0xFF0000;

function Player(options) {
    options = options || {};
    this.homeBase = null;
    this.buildings = [];
    this.units = [];
    this.color = options.color || (lastPlayerColor = lastPlayerColor >> 7);
    this.score = 0;
    this.resources = Object.assign({
        energy: 0,
        metal: 0,
        ammo: 0
    }, options.resources);
    this.resourceStorage = {
        energy: 0,
        metal: 0,
        ammo: 0
    };
    var buildingCounts = {};
    this.addBuilding = function (building) {
        this.buildings.push(building);
        buildingCounts[building.name] = (buildingCounts[building.name] || 0) + 1;
    };
    this.removeBuilding = function (building) {
        var index = this.buildings.indexOf(building);
        if (index >= 0) {
            this.buildings.splice(index, 1);
            buildingCounts[building.name] = (buildingCounts[building.name] || 0) - 1;
        }
    };
    this.buildingCount = function (building) {
        if (building) {
            return buildingCounts[building.name] || 0;
        } else {
            return this.buildings.length;
        }
    };
    this.addUnit = function (unit) {
        this.units.push(unit);
    };
    this.removeUnit = function (unit) {
        var index = this.units.indexOf(unit);
        if (index >= 0) {
            this.units.splice(index, 1);
        }
    };
    /** @returns boolean **/
    this.tryApplyCost = function (costs) {
        if (costs == null) return false;
        if (!this.testApplyCost(costs)) return false;
        for (var cost in costs) {
            if (costs.hasOwnProperty(cost)) {
                if (typeof(costs[cost]) == 'function')
                    this.resources[cost] -= costs[cost](this);
                else
                    this.resources[cost] -= costs[cost];
            }
        }
        return true;
    };
    /** @returns boolean **/
    this.testApplyCost = function (costs) {
        if (costs == null) return false;
        for (var cost in costs) {
            if (costs.hasOwnProperty(cost)) {
                if (typeof(costs[cost]) == 'function') {
                    if (this.resources[cost] < costs[cost]()) return false;
                }
                else {
                    if (this.resources[cost] < costs[cost]) return false;
                }
            }
        }
        return true;
    };
    this.canBuy = function (constructor) {
        return this.testApplyCost(constructor.cost);
    };
    this.updateResourceStorageLimits = function () {
        for (var key in this.resourceStorage) {
            if (this.resourceStorage.hasOwnProperty(key)
                && this.resources[key] > this.resourceStorage[key]) {
                this.resources[key] = this.resourceStorage[key];
            }
        }
    };
    this.update = function () {
        this.updateResourceStorageLimits();
    };

    this.actions = actions(this);
}

