module.exports = [];

[
    require('./building.ammo-fab'),
    require('./building.beam'),
    require('./building.behemoth'),
    require('./building.cannon'),
    require('./building.cross-eyes'),
    require('./building.energy-fab'),
    require('./building.fast-gun'),
    require('./building.grenade'),
    require('./building.gun'),
    require('./building.home-base'),
    require('./building.laser'),
    require('./building.lethargic-cannon'),
    require('./building.machine-gun'),
    require('./building.metal-fab'),
    require('./building.missile'),
    require('./building.sharp-shooter'),
    require('./building.shocker'),
    require('./building.wall')
]
    .forEach(function (building) {
        module.exports.push(building);
        module.exports[building.name] = building;
    });
