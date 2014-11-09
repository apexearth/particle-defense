define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'CrossEyes',
        constructor: {
            Cost: {
                Energy: 35,
                Metal: 20
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(100, 15, 2.5, .5, .85, 3)]
        }
    });
});