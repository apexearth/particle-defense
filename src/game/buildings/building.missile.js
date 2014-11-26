define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'MissileLauncher',
        constructor: {
            Cost: {
                Energy: 60,
                Metal: 30
            }
        },
        getSprite: Images.Buildings.LargePlatform,
        template: {
            Health: 5,
            Weapons: [Weapons.Missile(150, 45, 2, .1, 1, .95, .5, 1, 8)]
        }
    });
});