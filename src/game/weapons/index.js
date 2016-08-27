module.exports = {};

[
    require('./weapon.cannon.js'),
    require('./weapon.grenadelauncher'),
    require('./weapon.gun'),
    require('./weapon.laser'),
    require('./weapon.missile'),
    require('./weapon.shocker')
]
    .forEach(function (weapon) {
        module.exports[weapon.name] = weapon;
    });
