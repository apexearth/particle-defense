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
        PIXI.MainContainer.scale.x = PIXI.MainContainer.scale.y = Math.max(.2, Math.min(5, PIXI.MainContainer.scale.y - (delta < 0 ? .2 : -.2)));

    });

    requestAnimFrame(animate);
    return PIXI;
});