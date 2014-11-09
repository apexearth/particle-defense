define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'Behemoth',
        constructor: {
            Cost: {
                Energy: 50,
                Metal: 40
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(300, 60, 8, 6, .98, 1)]
        }
    });
});