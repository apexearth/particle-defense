var Settings = require('../Settings');
var Attribute = require('../Attribute');
var General = require('../../util/General');
var PIXI = require('pixi.js');

module.exports = Building;
function Building(level, player, templates) {
    PIXI.Container.call(this);
    level.addChild(this);
    var me = this;

    this.graphics = new PIXI.Graphics();
    this.addChildAt(this.graphics, 0);
    this.graphics.beginFill(0x77FF77, .1);
    this.graphics.drawRect(-Settings.BlockSize / 2, -Settings.BlockSize / 2, Settings.BlockSize, Settings.BlockSize);
    this.graphics.endFill();

    this.overlayGraphics = new PIXI.Graphics();
    this.addChild(this.overlayGraphics);
    
    this.blockX = NaN;
    this.blockY = NaN;
    this.block = null;
    this.health = 1000;
    this.width = Settings.BlockSize;
    this.height = Settings.BlockSize;
    this.level = level;
    this.player = player;
    this.abilities = null;
    this.resourceGeneration = {};
    this.resourceStorage = {
        energy: 0,
        metal: 0,
        ammo: 0
    };
    this.weapons = [];
    this.updates = [];
    
    this.upgradeCount = 0;
    this.Attributes       = {};
    this.updateAttributes = function () {

        var createAttributeForStorage    = function (resourceName, energyFactor, metalFactor) {
            if (me.resourceStorage[resourceName] > 0) {
                me.Attributes[resourceName + 'Storage'] = new Attribute(me,
                    function () {
                        return me.resourceStorage[resourceName];
                    },
                    function () {
                        me.resourceStorage[resourceName] += 25;
                    },
                    null,
                    {
                        /** @returns Number **/
                        energy: function () {
                            return me.resourceStorage[resourceName] * energyFactor;
                        },
                        /** @returns Number **/
                        metal: function () {
                            return me.resourceStorage[resourceName] * metalFactor;
                        }
                    }
                );
            }
        };
        var createAttributeForGeneration = function (resourceName, energyFactor, metalFactor) {
            if (me.resourceGeneration[resourceName] > 0) {
                me.Attributes[resourceName + 'Generation'] = new Attribute(me,
                    function () {
                        return me.resourceGeneration[resourceName];
                    },
                    function () {
                        me.resourceGeneration[resourceName] *= 1.25;
                    },
                    null,
                    {
                        /** @returns Number **/
                        energy: function () {
                            return me.resourceGeneration[resourceName] * energyFactor;
                        },
                        /** @returns Number **/
                        metal: function () {
                            return me.resourceGeneration[resourceName] * metalFactor;
                        }
                    }
                );
            }
        };
        
        createAttributeForStorage('ammo', .5, .25);
        createAttributeForStorage('energy', .5, .25);
        createAttributeForStorage('metal', 1, .5);
        
        createAttributeForGeneration('ammo', 2, 4);
        createAttributeForGeneration('energy', 8, 3);
        createAttributeForGeneration('metal', 8, 13);

    };
    var selected = false;
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
        }
    });

    this.update         = function () {
        if (this.health <= 0) {
            Building.prototype.removeStorageFromPlayer.call(this);
            this.level.buildings.splice(this.level.buildings.indexOf(this), 1);
            this.player.buildings.splice(this.player.buildings.indexOf(this), 1);
            delete this.block.building;
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
        if (this.selected || level.getPlacementBuilding === this) {
            this.overlayGraphics.lineStyle(2, 0x7799FF, .2);
            i = this.weapons.length;
            var weaponRadius = 0;
            while (i--) weaponRadius = Math.max(weaponRadius, this.weapons[i].range);
            this.overlayGraphics.beginFill(0x7799FF, .1);
            this.overlayGraphics.drawCircle(0, 0, weaponRadius);
            this.overlayGraphics.endFill();
        }
        if (this.selected) {
            this.overlayGraphics.beginFill(0x77FF77, .25);
            this.overlayGraphics.drawRect(-Settings.BlockSize / 2, -Settings.BlockSize / 2, Settings.BlockSize, Settings.BlockSize);
            this.overlayGraphics.endFill();
        }
    };
    this.updatePosition = function () {
        this.position.x = this.blockX * Settings.BlockSize + Settings.BlockSize / 2;
        this.position.y = this.blockY * Settings.BlockSize + Settings.BlockSize / 2;
    };
    this.initialize = function () {
        this.updatePosition();
        if (this.block != null) {           // Reset Block if Reinitializing.
            this.block.building = null;
        }
        if (this.level !== null) this.block = this.level.getBlockOrNull(this.blockX, this.blockY);
        if (this.block !== null) this.block.building = this;
    };
    this.loadTemplate = function (template, ignoreArray) {
        General.NestedCopyTo(template, this, ignoreArray);
        this.updateAttributes();
    };
    this.loadTemplates = function () {
        if (templates === undefined)return;
        if (templates instanceof Array)
            for (var template in templates) {
                if (templates.hasOwnProperty(template))
                    this.loadTemplate(templates[template]);
            }
        else
            this.loadTemplate(templates);
    };

    if (player) {
        player.addBuildingCost(this.Name);
    }
    this.loadTemplates();
    Building.prototype.addStorageToPlayer.call(this);
    this.initialize();
}
Building.prototype             = Object.create(PIXI.Container.prototype);
Building.prototype.constructor = Building;

Building.prototype.addStorageToPlayer      = function () {
    if (this.player === null) return;
    for (var key in this.resourceStorage) {
        if (this.resourceStorage.hasOwnProperty(key)) {
            this.player.resourceStorage[key] += this.resourceStorage[key];
        }
    }
};
Building.prototype.removeStorageFromPlayer = function () {
    if (this.player === null) return;
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
