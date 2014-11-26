define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'FastGun',
        constructor: {
            Cost: {
                Energy: 30,
                Metal: 15
            }
        },
        getSprite: Images.Buildings.Platform,
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(75, 25, 5, 1, .96, 1)]
        }
    });
});