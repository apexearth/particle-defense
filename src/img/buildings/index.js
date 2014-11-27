define(["pixi"], function (PIXI) {
    return {
        AmmoFab: function () {
            var sprite = PIXI.Sprite.fromImage("./img/buildings/ammofab.png", false, 1);
            sprite.scale.x = sprite.scale.y = 2;
            sprite.anchor.x = sprite.anchor.y = .5;
            return sprite;
        },
        EnergyFab: function () {
            var sprite = PIXI.Sprite.fromImage("./img/buildings/energyfab.png", false, 1);
            sprite.scale.x = sprite.scale.y = 2;
            sprite.anchor.x = sprite.anchor.y = .5;
            return sprite;
        },
        HomeBase: function () {
            var sprite = PIXI.Sprite.fromImage("./img/buildings/homebase.png", false, 1);
            sprite.scale.x = sprite.scale.y = 2;
            sprite.anchor.x = sprite.anchor.y = .5;
            return sprite;
        },
        MetalFab: function () {
            var sprite = PIXI.Sprite.fromImage("./img/buildings/metalfab.png", false, 1);
            sprite.scale.x = sprite.scale.y = 2;
            sprite.anchor.x = sprite.anchor.y = .5;
            return sprite;
        },
        SmallPlatform: function () {
            var sprite = PIXI.Sprite.fromImage("./img/buildings/platform.png", false, 1);
            sprite.scale.x = sprite.scale.y = 2;
            sprite.anchor.x = sprite.anchor.y = .5;
            return sprite;
        },
        Platform: function () {
            var sprite = PIXI.Sprite.fromImage("./img/buildings/platform.png", false, 1);
            sprite.scale.x = sprite.scale.y = 3;
            sprite.anchor.x = sprite.anchor.y = .5;
            return sprite;
        },
        LargePlatform: function () {
            var sprite = PIXI.Sprite.fromImage("./img/buildings/platform.png", false, 1);
            sprite.scale.x = sprite.scale.y = 4;
            sprite.anchor.x = sprite.anchor.y = .5;
            return sprite;
        }

    };
});