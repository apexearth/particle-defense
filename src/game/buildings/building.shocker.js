define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'Shocker',
        constructor: {
            Cost: {
                Energy: 25,
                Metal: 20
            }
        },
        getSprite: Images.Buildings.LargePlatform,
        template: {
            Health: 5,
            Canvas: function (canvas) {
                // nothing yet
            },
            Weapons: [Weapons.Shocker(100, 30, 10, 1)]
        }
    });
});