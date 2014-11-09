define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'MissileLauncher',
        constructor: {
            Cost: {
                Energy: 60,
                Metal: 30
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Missile(150, 45, 2, .1, 1, .95, .5, 1, 8)]
        }
    });
});