define('game/PIXI', ["pixi", "../util/input!", "../util/math!"], function (PIXI, input, math) {
    PIXI.Point = math.Vector;
    var Mouse = input.Mouse;
    var Keyboard = input.Keyboard;

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

        var container = PIXI.MainContainer;
        if (Mouse.RightButton) {
            container.position.x += Mouse.x - lastMouseX;
            container.position.y += Mouse.y - lastMouseY;
        }

        var scrollSpeed = 6;
        if (Keyboard.CheckKey(Keyboard.Keys.up_arrow) || Keyboard.CheckKey(Keyboard.Keys.w)) {
            container.position.y += scrollSpeed;
        }
        if (Keyboard.CheckKey(Keyboard.Keys.down_arrow) || Keyboard.CheckKey(Keyboard.Keys.s)) {
            container.position.y -= scrollSpeed;
        }
        if (Keyboard.CheckKey(Keyboard.Keys.left_arrow) || Keyboard.CheckKey(Keyboard.Keys.a)) {
            container.position.x += scrollSpeed;
        }
        if (Keyboard.CheckKey(Keyboard.Keys.right_arrow) || Keyboard.CheckKey(Keyboard.Keys.d)) {
            container.position.x -= scrollSpeed;
        }
        var zoomSpeed = .02;
        if (Keyboard.CheckKey(Keyboard.Keys.dash) && container.scale.y > .2) {
            container.position.x -= (container.position.x - window.innerWidth / 2) * zoomSpeed / container.scale.y;
            container.position.y -= (container.position.y - window.innerHeight / 2) * zoomSpeed / container.scale.y;
            container.scale.x = container.scale.y = Math.max(.2, container.scale.y - zoomSpeed);
        }
        if (Keyboard.CheckKey(Keyboard.Keys.equal_sign) && container.scale.y < 4) {
            container.position.x += (container.position.x - window.innerWidth / 2) * zoomSpeed / container.scale.y;
            container.position.y += (container.position.y - window.innerHeight / 2) * zoomSpeed / container.scale.y;
            container.scale.x = container.scale.y = Math.min(4, container.scale.y + zoomSpeed);
        }

        renderer.render(stage);
        lastMouseX = Mouse.x;
        lastMouseY = Mouse.y;
    }

    Mouse.AddWheelEvent(function (delta) {
        var containerOffsetX, containerOffsetY;
        var container = PIXI.MainContainer,
            change = (delta < 0 ? .2 : -.2);

        if (delta < 0 && container.scale.y > .2) {
            container.position.x -= (container.position.x - window.innerWidth / 2) * change / container.scale.y;
            container.position.y -= (container.position.y - window.innerHeight / 2) * change / container.scale.y;
            container.scale.x = container.scale.y = Math.max(.2, container.scale.y - change);
        }
        if (delta > 0 && container.scale.y < 4) {
            containerOffsetX = Mouse.x - window.innerWidth / 2;
            containerOffsetY = Mouse.y - window.innerHeight / 2;
            container.position.x += containerOffsetX * change;
            container.position.y += containerOffsetY * change;
            container.scale.x = container.scale.y = Math.min(4, container.scale.y - change);
        }
    });

    requestAnimFrame(animate);
    return PIXI;
});