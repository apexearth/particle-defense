define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'Cannon',
        constructor: {
            Cost: {
                Energy: 60,
                Metal: 30
            }
        },
        getSprite: Images.Buildings.LargePlatform,
        template: {
            Health: 5,
            Weapons: [Weapons.Cannon(100, 30, 3, 1.5, .95, 1, .35, 1, 5)]
        }
    });
});