define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'FastGun',
        constructor: {
            Cost: {
                Energy: 30,
                Metal: 15
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(75, 25, 5, 1, .96, 1)]
        }
    });
});