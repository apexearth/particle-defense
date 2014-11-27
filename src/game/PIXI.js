define('game/PIXI', ["pixi", "../util/input!", "../util/math!"], function (PIXI, input, math) {
    PIXI.Point = math.Vector;
    var Mouse = input.Mouse;

    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: true});
    document.body.appendChild(renderer.view);
    var stage = new PIXI.Stage(0x151515);
    PIXI.MainContainer = stage.addChild(new PIXI.DisplayObjectContainer());
    PIXI.MainContainer.position.x = window.innerWidth / 2;
    PIXI.MainContainer.position.y = window.innerHeight / 2;

    var lastMouseX = Mouse.x;
    var lastMouseY = Mouse.y;

    function animate() {
        requestAnimFrame(animate);
        if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
            renderer.resize(window.innerWidth, window.innerHeight);
        }

        if (Mouse.RightButton) {
            PIXI.MainContainer.position.x += Mouse.x - lastMouseX;
            PIXI.MainContainer.position.y += Mouse.y - lastMouseY;
        }

        renderer.render(stage);
        lastMouseX = Mouse.x;
        lastMouseY = Mouse.y;
    }

    Mouse.AddWheelEvent(function (delta) {
        var containerOffsetX, containerOffsetY;
        var container = PIXI.MainContainer,
            change = (delta < 0 ? .2 : -.2);
        if (delta < 0 && container.scale.y >= .2) {
            containerOffsetX = -Mouse.x + window.innerWidth / 2;
            containerOffsetY = -Mouse.y + window.innerHeight / 2;
            container.position.x -= containerOffsetX * change;
            container.position.y -= containerOffsetY * change;
            container.scale.x = container.scale.y = container.scale.y - change;
        }
        if (delta > 0 && container.scale.y <= 4) {
            containerOffsetX = Mouse.x - window.innerWidth / 2;
            containerOffsetY = Mouse.y - window.innerHeight / 2;
            container.position.x += containerOffsetX * change;
            container.position.y += containerOffsetY * change;
            container.scale.x = container.scale.y = container.scale.y - change;
        }
    });

    requestAnimFrame(animate);
    return PIXI;
});