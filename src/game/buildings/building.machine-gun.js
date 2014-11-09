define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'MachineGun',
        constructor: {
            Cost: {
                Energy: 45,
                Metal: 20
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(100, 5, 2.5, 1.25, .9, 2)]
        }
    });
});