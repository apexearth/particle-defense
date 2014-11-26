define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'Behemoth',
        constructor: {
            Cost: {
                Energy: 50,
                Metal: 40
            }
        },
        getSprite: Images.Buildings.LargePlatform,
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(300, 60, 8, 6, .98, 1)]
        }
    });
});