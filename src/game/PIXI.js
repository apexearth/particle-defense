define('game/PIXI', ["pixi", "../util/input!", "../util/math!"], function (PIXI, input, math) {
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
        if (window.innerWidth !== renderer.view.width) renderer.view.width = window.innerWidth;
        if (window.innerHeight !== renderer.view.height) renderer.view.height = window.innerHeight;

        if (Mouse.RightButton) {
            PIXI.MainContainer.position.x += Mouse.x - lastMouseX;
            PIXI.MainContainer.position.y += Mouse.y - lastMouseY;
        }
        renderer.render(stage);
        lastMouseX = Mouse.x;
        lastMouseY = Mouse.y;
    }

    PIXI.CreateDisplayObjectContainerFunction = function (func) {
        return function (parent) {
            var container = new PIXI.DisplayObjectContainer();
            parent.addChild(container);
            func.call(container, parent);
            return container;
        };
    };
    PIXI.Point = math.Vector;

    requestAnimFrame(animate);
    return PIXI;
});