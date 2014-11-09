define(["./building.loader","../Weapons"],function(loader, Weapons){
    return loader({
        name: 'Gun',
        constructor: {
            Cost: {
                Energy: 20,
                Metal: 10
            }
        },
        template: {
            Health: 5,
            Weapons: [Weapons.Gun(100, 30, 3, 1, .95, 1)]
        }
    });
});