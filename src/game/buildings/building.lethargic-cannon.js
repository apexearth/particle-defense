define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'LethargicCannon',
        constructor: {
            Cost: {
                Energy: 60,
                Metal: 30
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Cannon(85, 30, 1.75, 1.75, .95, 1, .15, 4, 7)]
        }
    });
});