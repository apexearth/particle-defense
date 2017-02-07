const PIXI = require('pixi.js');
const input = require('./inputs');
const math = require('../util/math');
const raf = require('raf');

PIXI.Point = math.Vector;
const stage = new PIXI.Container();

let lastMouseX = input('mouseX');
let lastMouseY = input('mouseY');

function width() {
    return typeof window !== 'undefined' ? window.innerWidth : 500;
}
function height() {
    return typeof window !== 'undefined' ? window.innerHeight : 500;
}

const renderer = typeof navigator !== 'undefined' && PIXI.autoDetectRenderer(width(), height(), {antialias: true});
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
        stage.position.x += (input('mouseX') - window.innerWidth / 2) * change;
        stage.position.y += (input('mouseY') - window.innerHeight / 2) * change;
        stage.scale.x = stage.scale.y = Math.min(4, stage.scale.y - change);
    }
}

function animate() {
    if (!enabled) return;
    raf(animate);
    if (window.innerWidth !== renderer.view.width || window.innerHeight !== renderer.view.height) {
        renderer.resize(window.innerWidth, window.innerHeight);
    }

    if (input('pan')) {
        stage.position.x += input('mouseX') - lastMouseX;
        stage.position.y += input('mouseY') - lastMouseY;
    }

    const scrollSpeed = 6;
    if (input('up')) {
        stage.position.y += scrollSpeed;
    }
    if (input('down')) {
        stage.position.y -= scrollSpeed;
    }
    if (input('left')) {
        stage.position.x += scrollSpeed;
    }
    if (input('right')) {
        stage.position.x -= scrollSpeed;
    }
    const zoomSpeed = .02;
    if (input('zoomOut') && stage.scale.y > .2) {
        stage.position.x -= (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y;
        stage.position.y -= (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.max(.2, stage.scale.y - zoomSpeed);
    }
    if (input('zoomIn') && stage.scale.y < 4) {
        stage.position.x += (stage.position.x - window.innerWidth / 2) * zoomSpeed / stage.scale.y;
        stage.position.y += (stage.position.y - window.innerHeight / 2) * zoomSpeed / stage.scale.y;
        stage.scale.x = stage.scale.y = Math.min(4, stage.scale.y + zoomSpeed);
    }

    renderer.render(stage);
    lastMouseX = input('mouseX');
    lastMouseY = input('mouseY');
}
