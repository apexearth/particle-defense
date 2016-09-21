var PIXI = require('pixi.js');
var input = require('./inputs');
var math = require('../util/math');
var raf = require('raf');

PIXI.Point = math.Vector;
var stage = new PIXI.Container();

var lastMouseX = input.mouse('x');
var lastMouseY = input.mouse('y');

function width() {
    return typeof window !== 'undefined' ? window.innerWidth : 500;
}
function height() {
    return typeof window !== 'undefined' ? window.innerWidth : 500;
}

var renderer = typeof navigator !== 'undefined' && PIXI.autoDetectRenderer(width(), height(), {antialias: true});
var enabled = false;

module.exports = {
    stage: stage,
    resetPosition: function () {
        stage.position.x = width() / 2;
        stage.position.y = height() / 2;
        stage.scale.x = 1;
        stage.scale.y = 1;
    },
    start: function (container) {
        if (typeof window !== 'undefined') {
            this.resetPosition();
            stage.addChild(container);
            document.addEventListener('mousewheel', zoom);
            document.body.appendChild(renderer.view);
            enabled = true;
            raf(animate);
        }
    },
    stop: function () {
        if (typeof window !== 'undefined') {
            while (stage.children.length > 0) {
                stage.removeChildAt(0);
            }
            document.removeEventListener('mousewheel', zoom);
            document.body.removeChild(renderer.view);
            enabled = false;
        }
    }
};

Object.defineProperties(module.exports, {
    position: {
        get: function () {
            return stage.position;
        }
    },
    scale: {
        get: function () {
            return stage.scale;
        }
    }
});

function zoom(event) {
    var change = (event.deltaY > 0 ? .2 : -.2);
    if (change > 0 && stage.scale.y > .2) {
        stage.position.x -= (stage.position.x - window.innerWidth / 2) * change / stage.scale.y;
        stage.position.y -= (stage.position.y - window.innerHeight / 2) * change / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.max(.2, stage.scale.y - change);
    }
    if (change < 0 && stage.scale.y < 4) {
        stage.position.x += (input.mouse('x') - window.innerWidth / 2) * change;
        stage.position.y += (input.mouse('y') - window.innerHeight / 2) * change;
        stage.scale.x = stage.scale.y = Math.min(4, stage.scale.y - change);
    }
}

function animate() {
    if (!enabled) return;
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
