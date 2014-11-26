define(["../../img!", "./building.loader", "../Weapons"],function(Images, loader, Weapons){
    return loader({
        name: 'Gun',
        constructor: {
            Cost: {
                Energy: 20,
                Metal: 10
            }
        },
        getSprite: Images.Buildings.SmallPlatform,
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(100, 30, 3, 1, .95, 1)]
        }
    });
});