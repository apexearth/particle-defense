/// <reference path="~/util/Display.js"/>
Mouse = {
    X: 0,
    Y: 0,
    DisplayX: 0,
    DisplayY: 0,
    LeftButton: false,
    MiddleButton: false,
    RightButton: false,
    update: function () {
        var coords = Display.inverseTranslateCoordinate(Mouse.X, Mouse.Y);
        Mouse.DisplayX = coords.x;
        Mouse.DisplayY = coords.y;
    }
};

document.addEventListener('mousemove', function (e) {
    Mouse.X = e.clientX || e.pageX;
    Mouse.Y = e.clientY || e.pageY;
}, false);
document.addEventListener('mousedown', function (e) {
    if (e.button == 0) Mouse.LeftButton = true;
    if (e.button == 1) Mouse.MiddleButton = true;
    if (e.button == 2) Mouse.RightButton = true;
}, false);
document.addEventListener('mouseup', function (e) {
    if (e.button == 0) Mouse.LeftButton = false;
    if (e.button == 1) Mouse.MiddleButton = false;
    if (e.button == 2) Mouse.RightButton = false;
}, false);

document.addEventListener('contextmenu', function () {
    window.focus();
    return false;
});
document.addEventListener('dblclick', function () {
    window.focus();
    return false;
});