var loader    = require("./building.loader");
var color     = require("color");
var Settings  = require("../Settings");
var Attribute = require("../Attribute");
var General   = require("../../util/General");
var PIXI      = require("pixi.js");

module.exports = Building
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

    this.BlockX             = NaN;
    this.BlockY             = NaN;
    this.Block              = null;
    this.Health             = 1000;
    this.Width              = Settings.BlockSize;
    this.Height             = Settings.BlockSize;
    this.Level              = level;
    this.Player             = player;
    this.Abilities          = null;
    this.ResourceGeneration = {};
    this.ResourceStorage    = {
        Energy: 0,
        Metal:  0,
        Ammo:   0
    };
    this.Weapons            = [];
    this.Updates            = [];

    this.NumberOfUpgrades = 0;
    this.Attributes       = {};
    this.UpdateAttributes = function () {

        var createAttributeForStorage    = function (resourceName, energyFactor, metalFactor) {
            if (me.ResourceStorage[resourceName] > 0) {
                me.Attributes[resourceName + 'Storage'] = new Attribute(me,
                    function () {
                        return me.ResourceStorage[resourceName];
                    },
                    function () {
                        me.ResourceStorage[resourceName] += 25;
                    },
                    null,
                    {
                        /** @returns Number **/
                        Energy: function () {
                            return me.ResourceStorage[resourceName] * energyFactor;
                        },
                        /** @returns Number **/
                        Metal:  function () {
                            return me.ResourceStorage[resourceName] * metalFactor;
                        }
                    }
                )
            }
        };
        var createAttributeForGeneration = function (resourceName, energyFactor, metalFactor) {
            if (me.ResourceGeneration[resourceName] > 0) {
                me.Attributes[resourceName + 'Generation'] = new Attribute(me,
                    function () {
                        return me.ResourceGeneration[resourceName];
                    },
                    function () {
                        me.ResourceGeneration[resourceName] *= 1.25;
                    },
                    null,
                    {
                        /** @returns Number **/
                        Energy: function () {
                            return me.ResourceGeneration[resourceName] * energyFactor;
                        },
                        /** @returns Number **/
                        Metal:  function () {
                            return me.ResourceGeneration[resourceName] * metalFactor;
                        }
                    }
                )
            }
        };

        createAttributeForStorage("Ammo", .5, .25);
        createAttributeForStorage("Energy", .5, .25);
        createAttributeForStorage("Metal", 1, .5);

        createAttributeForGeneration("Ammo", 2, 4);
        createAttributeForGeneration("Energy", 8, 3);
        createAttributeForGeneration("Metal", 8, 13);

    };
    var _isSelected       = false;
    /** @returns bool **/
    this.IsSelected = function () {
        return _isSelected;
    };
    this.Select   = function () {
        this.Abilities = new Building.Abilities(this);
        _isSelected    = true;
    };
    this.Deselect = function () {
        this.Abilities = null;
        _isSelected    = false;
    };

    this.update         = function () {
        if (this.Health <= 0) {
            Building.prototype.removeStorageFromPlayer.call(this);
            this.Level.Buildings.splice(this.Level.Buildings.indexOf(this), 1);
            this.Player.Buildings.splice(this.Player.Buildings.indexOf(this), 1);
            delete this.Block.Building;
            return;
        }

        for (var r in this.ResourceGeneration) {
            if (this.ResourceGeneration.hasOwnProperty(r)) {
                this.Player.Resources[r] += this.ResourceGeneration[r] / Settings.Second;
            }
        }

        var i = this.Updates.length;
        while (i--) this.Updates[i].call(this);
        i = this.Weapons.length;
        while (i--) this.Weapons[i].update();

        // Graphics
        this.overlayGraphics.clear();
        if (this.IsSelected() || level.getPlacementBuilding === this) {
            this.overlayGraphics.lineStyle(2, 0x7799FF, .2);
            i                = this.Weapons.length;
            var weaponRadius = 0;
            while (i--) weaponRadius = Math.max(weaponRadius, this.Weapons[i].Range);
            this.overlayGraphics.beginFill(0x7799FF, .1);
            this.overlayGraphics.drawCircle(0, 0, weaponRadius);
            this.overlayGraphics.endFill();
        }
        if (this.IsSelected()) {
            this.overlayGraphics.beginFill(0x77FF77, .25);
            this.overlayGraphics.drawRect(-Settings.BlockSize / 2, -Settings.BlockSize / 2, Settings.BlockSize, Settings.BlockSize);
            this.overlayGraphics.endFill();
        }
    };
    this.updatePosition = function () {
        this.position.x = this.BlockX * Settings.BlockSize + Settings.BlockSize / 2;
        this.position.y = this.BlockY * Settings.BlockSize + Settings.BlockSize / 2;
    };
    this.initialize     = function () {
        this.updatePosition();
        if (this.Block != null) {           // Reset Block if Reinitializing.
            this.Block.RemoveBuilding();
        }
        if (this.Level !== null) this.Block = this.Level.getBlockOrNull(this.BlockX, this.BlockY);
        if (this.Block !== null) this.Block.SetBuilding(this);
    };
    this.loadTemplate   = function (template, ignoreArray) {
        General.NestedCopyTo(template, this, ignoreArray);
        this.UpdateAttributes();
    };
    this.loadTemplates  = function () {
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
        player.AddBuildingCount(this.Name);
    }
    this.loadTemplates();
    Building.prototype.addStorageToPlayer.call(this);
    this.initialize();
}
Building.prototype             = Object.create(PIXI.Container.prototype);
Building.prototype.constructor = Building;

Building.prototype.addStorageToPlayer      = function () {
    if (this.Player === null) return;
    for (var key in this.ResourceStorage) {
        if (this.ResourceStorage.hasOwnProperty(key)) {
            this.Player.ResourceStorage[key] += this.ResourceStorage[key];
        }
    }
};
Building.prototype.removeStorageFromPlayer = function () {
    if (this.Player === null) return;
    for (var key in this.ResourceStorage) {
        if (this.ResourceStorage.hasOwnProperty(key)) {
            this.Player.ResourceStorage[key] -= this.ResourceStorage[key];
        }
    }
};

Building.Abilities = function (building) {
    this.Building = building;
    // Add Weapon Upgrades
    this.Upgrades = {};
    var i         = building.Weapons.length;
    while (i--) {
        this.Upgrades['Weapon' + (i === 0 ? "" : i)] = building.Weapons[i].Attributes;
    }
    this.Upgrades.Building = this.Building.Attributes;
};
