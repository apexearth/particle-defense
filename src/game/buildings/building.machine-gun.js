define(["../../img!", "./building.loader", "../Weapons"], function (Images, loader, Weapons) {
    return loader({
        name: 'MachineGun',
        constructor: {
            Cost: {
                Energy: 45,
                Metal: 20
            }
        },
        getSprite: Images.Buildings.LargePlatform,
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(100, 5, 2.5, 1.25, .9, 2)]
        }
    });
});