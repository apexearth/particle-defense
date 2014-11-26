define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'LethargicCannon',
        constructor: {
            Cost: {
                Energy: 60,
                Metal: 30
            }
        },
        getSprite: Images.Buildings.LargePlatform,
        template: {
            Health: 5,
            Weapons: [Weapons.Cannon(85, 30, 1.75, 1.75, .95, 1, .15, 4, 7)]
        }
    });
});