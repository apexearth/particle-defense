define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'SharpShooter',
        constructor: {
            Cost: {
                Energy: 40,
                Metal: 20
            }
        },
        getSprite: Images.Buildings.LargePlatform,
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(150, 20, 7, 3, .97, 1)]
        }
    });
});