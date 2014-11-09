define(["./building.loader", "../Weapons"], function (loader, Weapons) {
    return loader({
        name: 'Shocker',
        constructor: {
            Cost: {
                Energy: 25,
                Metal: 20
            }
        },
        template: {
            Health: 5,
            Canvas: function (canvas) {
                // nothing yet
            },
            Weapons: [Weapons.Shocker(100, 30, 10, 1)]
        }
    });
});