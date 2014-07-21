/// <reference path="~/Game/Buildings/HomeBase.js" />
function Player(level) {
    this.Level = level;
    this.HomeBase = null;
    this.Buildings = [];
    this.Resources = {
        Energy: 0,
        Metal: 0
    };
}