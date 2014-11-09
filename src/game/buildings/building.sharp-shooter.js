define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'SharpShooter',
        constructor: {
            Cost: {
                Energy: 40,
                Metal: 20
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(150, 20, 7, 3, .97, 1)]
        }
    });
});