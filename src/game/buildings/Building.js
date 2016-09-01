﻿var Settings = require('../Settings');
var Attribute = require('../Attribute');
var PIXI = require('pixi.js');

module.exports = Building;
function Building(options) {
    if (!options) throw new Error('Options are required to create a building');
    if (!options.level) throw new Error('A level is required to create a building.');
    if (!options.player) throw new Error('A player is required to create a building.');
    this.level = options.level;
    this.player = options.player;
    options.blockX = options.blockX || 0;
    options.blockY = options.blockY || 0;

    this.block = null;
    this.blockX = options.blockX;
    this.blockY = options.blockY;

    this.container = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.container.addChildAt(this.graphics, 0);
    this.overlayGraphics = new PIXI.Graphics();
    this.container.addChild(this.overlayGraphics);

    this.graphics.beginFill(0x77FF77, .1);
    this.graphics.drawRect(-Settings.BlockSize / 2, -Settings.BlockSize / 2, Settings.BlockSize, Settings.BlockSize);
    this.graphics.endFill();

    var selected = false;
    this.health = 1000;
    this.width = Settings.BlockSize;
    this.height = Settings.BlockSize;
    this.abilities = null;
    this.resourceGeneration = Object.assign({}, options.resourceGeneration);
    this.resourceStorage = Object.assign({}, options.resourceGeneration);

    this.weapons = [];
    this.updates = [];

    this.upgradeCount = 0;
    this.attributes = {
        resourceGeneration: createAttributes(this.resourceGeneration),
        resourceStorage: createAttributes(this.resourceStorage)
    };

    function createAttributes(object) {
        var attributes = {};
        for (var key in object) {
            attributes[key] = new Attribute({
                parent: object,
                key: key,
                upgrade: {
                    factor: 1.1,
                    costMultiplier: 1.25,
                    cost: {
                        energy: object[key] * 10
                    }
                }
            });
        }
        return attributes;
    }


    Object.defineProperties(this, {
        selected: {
            get: function () {
                return selected;
            }.bind(this),
            set: function (value) {
                if (value) {
                    this.abilities = new Building.abilities(this);
                    selected = true;
                } else {
                    this.abilities = null;
                    selected = false;
                }
            }.bind(this)
        },
        position: {
            get: function () {
                return this.container.position;
            }.bind(this)
        }
    });

    this.position.x = this.blockX * Settings.BlockSize + Settings.BlockSize / 2;
    this.position.y = this.blockY * Settings.BlockSize + Settings.BlockSize / 2;

    this.addWeapon = function (weapon) {
        this.weapons.push(weapon);
    };

    this.removeWeapon = function (weapon) {
        var index = this.weapons.indexOf(weapon);
        if (index >= 0) {
            this.weapons.splice(index, 1);
        }
    };

    this.update = function () {
        if (this.health <= 0) {
            this.level.removeBuilding(this);
            return;
        }

        for (var r in this.resourceGeneration) {
            if (this.resourceGeneration.hasOwnProperty(r)) {
                this.player.resources[r] += this.resourceGeneration[r] / Settings.second;
            }
        }

        var i = this.updates.length;
        while (i--) this.updates[i].call(this);
        i = this.weapons.length;
        while (i--) this.weapons[i].update();

        // Graphics
        this.overlayGraphics.clear();
        if (selected || this.level.placementBuilding === this) {
            this.overlayGraphics.lineStyle(2, 0x7799FF, .2);
            i = this.weapons.length;
            var weaponRadius = 0;
            while (i--) weaponRadius = Math.max(weaponRadius, this.weapons[i].range);
            this.overlayGraphics.beginFill(0x7799FF, .1);
            this.overlayGraphics.drawCircle(0, 0, weaponRadius);
            this.overlayGraphics.endFill();
        }
        if (selected) {
            this.overlayGraphics.beginFill(0x77FF77, .25);
            this.overlayGraphics.drawRect(-Settings.BlockSize / 2, -Settings.BlockSize / 2, Settings.BlockSize, Settings.BlockSize);
            this.overlayGraphics.endFill();
        }
    };

}

Building.cost = {
    energy: 1,
    metal: 1
};

Building.prototype.addStorageToPlayer = function () {
    if (!this.player) return;
    for (var key in this.resourceStorage) {
        if (this.resourceStorage.hasOwnProperty(key)) {
            this.player.resourceStorage[key] += this.resourceStorage[key];
        }
    }
};
Building.prototype.removeStorageFromPlayer = function () {
    if (!this.player) return;
    for (var key in this.resourceStorage) {
        if (this.resourceStorage.hasOwnProperty(key)) {
            this.player.resourceStorage[key] -= this.resourceStorage[key];
        }
    }
};

Building.abilities = function (building) {
    this.building = building;
    // Add Weapon Upgrades
    this.upgrades = {};
    var i = building.weapons.length;
    while (i--) {
        this.upgrades['weapon' + (i === 0 ? '' : i)] = building.weapons[i].Attributes;
    }
    this.upgrades.building = this.building.Attributes;
};
