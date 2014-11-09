define(["./building.loader"], function (loader) {
    return loader({
        name: 'Wall',
        constructor: {
            Cost: {
                Energy: 4,
                Metal: 2
            }
        },
        template: {
            Health: 20
        }
    });
});