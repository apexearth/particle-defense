var PIXI = require('pixi.js');
var userInput = require('user-input');
var math = require('../util/math');
var raf = require('raf');

PIXI.Point   = math.Vector;
var input = userInput().withMouse().withKeyboard();
var stage = new PIXI.Container();

var lastMouseX = input.mouse('x');
var lastMouseY = input.mouse('y');

function animate() {
    raf(animate);
    if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
        renderer.resize(window.innerWidth, window.innerHeight);
    }

    if (input.mouse('mouse2')) {
        stage.position.x += input.mouse('x') - lastMouseX;
        stage.position.y += input.mouse('y') - lastMouseY;
    }

    var scrollSpeed = 6;
    if (input.keyboard('<up>') || input.keyboard('W')) {
        stage.position.y += scrollSpeed;
    }
    if (input.keyboard('<down>') || input.keyboard('S')) {
        stage.position.y -= scrollSpeed;
    }
    if (input.keyboard('<left>') || input.keyboard('A')) {
        stage.position.x += scrollSpeed;
    }
    if (input.keyboard('<right>') || input.keyboard('D')) {
        stage.position.x -= scrollSpeed;
    }
    var zoomSpeed = .02;
    if ((input.keyboard('-') || input.keyboard('<num-->')) && stage.scale.y > .2) {
        stage.position.x -= (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y;
        stage.position.y -= (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.max(.2, stage.scale.y - zoomSpeed);
    }
    if ((input.keyboard('=') || input.keyboard('<num-+>')) && stage.scale.y < 4) {
        stage.position.x += (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y;
        stage.position.y += (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.min(4, stage.scale.y + zoomSpeed);
    }

    renderer.render(stage);
    lastMouseX = input.mouse('x');
    lastMouseY = input.mouse('y');
}


module.exports = stage;

if (typeof window !== 'undefined') {

    document.addEventListener('mousewheel', function (event) {
        var delta = event.delta;
        var containerOffsetX, containerOffsetY;
        var change = (delta < 0 ? .2 : -.2);

        if (delta < 0 && stage.scale.y > .2) {
            stage.position.x -= (stage.position.x - window.innerWidth / 2) * change / stage.scale.y;
            stage.position.y -= (stage.position.y - window.innerHeight / 2) * change / stage.scale.y;
            stage.scale.x = stage.scale.y = Math.max(.2, stage.scale.y - change);
        }
        if (delta > 0 && stage.scale.y < 4) {
            containerOffsetX = input.mouse('x') - window.innerWidth / 2;
            containerOffsetY = input.mouse('y') - window.innerHeight / 2;
            stage.position.x += containerOffsetX * change;
            stage.position.y += containerOffsetY * change;
            stage.scale.x = stage.scale.y = Math.min(4, stage.scale.y - change);
        }
    });

    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: true});
    document.body.appendChild(renderer.view);
    stage.position.x = window.innerWidth / 2;
    stage.position.y = window.innerHeight / 2;
    raf(animate); // TODO: Needs a better home?
}