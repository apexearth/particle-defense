define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'Laser',
        constructor: {
            Cost: {
                Energy: 50,
                Metal: 25
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Laser(100, 60, 45, 4, .95)]
        }
    });
});