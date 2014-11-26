define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'Beam',
        constructor: {
            Cost: {
                Energy: 25,
                Metal: 20
            }
        },
        getSprite: Images.Buildings.SmallPlatform,
        template: {
            Health: 5,
            Weapons: [Weapons.Laser(100, 1, 3, .05, .95)]
        }
    });
});