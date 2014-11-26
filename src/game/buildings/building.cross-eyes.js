define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'CrossEyes',
        constructor: {
            Cost: {
                Energy: 35,
                Metal: 20
            }
        },
        getSprite: Images.Buildings.Platform,
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(100, 15, 2.5, .5, .85, 3)]
        }
    });
});