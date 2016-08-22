var PIXI = require('pixi.js');
var input = require('../util/input');
var math = require('../util/math');
var raf = require('raf');

PIXI.Point   = math.Vector;
var Mouse    = input.Mouse;
var Keyboard = input.Keyboard;

var stage = new PIXI.Container();

var lastMouseX = Mouse.x;
var lastMouseY = Mouse.y;

function animate() {
    raf(animate);
    if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
        renderer.resize(window.innerWidth, window.innerHeight);
    }

    if (Mouse.RightButton) {
        stage.position.x += Mouse.x - lastMouseX;
        stage.position.y += Mouse.y - lastMouseY;
    }

    var scrollSpeed = 6;
    if (Keyboard.CheckKey(Keyboard.Keys.up_arrow) || Keyboard.CheckKey(Keyboard.Keys.w)) {
        stage.position.y += scrollSpeed;
    }
    if (Keyboard.CheckKey(Keyboard.Keys.down_arrow) || Keyboard.CheckKey(Keyboard.Keys.s)) {
        stage.position.y -= scrollSpeed;
    }
    if (Keyboard.CheckKey(Keyboard.Keys.left_arrow) || Keyboard.CheckKey(Keyboard.Keys.a)) {
        stage.position.x += scrollSpeed;
    }
    if (Keyboard.CheckKey(Keyboard.Keys.right_arrow) || Keyboard.CheckKey(Keyboard.Keys.d)) {
        stage.position.x -= scrollSpeed;
    }
    var zoomSpeed = .02;
    if (Keyboard.CheckKey(Keyboard.Keys.dash) && stage.scale.y > .2) {
        stage.position.x -= (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y;
        stage.position.y -= (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.max(.2, stage.scale.y - zoomSpeed);
    }
    if (Keyboard.CheckKey(Keyboard.Keys.equal_sign) && stage.scale.y < 4) {
        stage.position.x += (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y;
        stage.position.y += (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.min(4, stage.scale.y + zoomSpeed);
    }

    renderer.render(stage);
    lastMouseX = Mouse.x;
    lastMouseY = Mouse.y;
}

Mouse.AddWheelEvent(function (delta) {
    var containerOffsetX, containerOffsetY;
    var change = (delta < 0 ? .2 : -.2);

    if (delta < 0 && stage.scale.y > .2) {
        stage.position.x -= (stage.position.x - window.innerWidth / 2) * change / stage.scale.y;
        stage.position.y -= (stage.position.y - window.innerHeight / 2) * change / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.max(.2, stage.scale.y - change);
    }
    if (delta > 0 && stage.scale.y < 4) {
        containerOffsetX = Mouse.x - window.innerWidth / 2;
        containerOffsetY = Mouse.y - window.innerHeight / 2;
        stage.position.x += containerOffsetX * change;
        stage.position.y += containerOffsetY * change;
        stage.scale.x    = stage.scale.y = Math.min(4, stage.scale.y - change);
    }
});

module.exports = stage;

if (typeof window !== 'undefined') {
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: true});
    document.body.appendChild(renderer.view);
    stage.position.x = window.innerWidth / 2;
    stage.position.y = window.innerHeight / 2;
    raf(animate); // TODO: Needs a better home?
}