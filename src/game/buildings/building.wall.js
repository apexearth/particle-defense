define(["../../img!", "./building.loader"], function (Images, loader) {
    return loader({
        name: 'Wall',
        constructor: {
            Cost: {
                Energy: 4,
                Metal: 2
            }
        },
        getSprite: Images.Buildings.SmallPlatform,
        template: {
            Health: 20
        }
    });
});