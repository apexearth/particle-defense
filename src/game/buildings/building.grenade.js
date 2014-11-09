define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'GrenadeLauncher',
        constructor: {
            Cost: {
                Energy: 60,
                Metal: 30
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.GrenadeLauncher(100, 30, 3, 2, 1, .95, 1, .35, 1, 5)]
        }
    });
});