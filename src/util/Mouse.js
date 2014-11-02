﻿define("util/Mouse", function () {
    var Mouse = {
        x: 0,
        y: 0,
        LeftButton: false,
        MiddleButton: false,
        RightButton: false,
        AddEvents: function (element) {
            element.addEventListener('mousemove', function (e) {
                Mouse.x = e.clientX || e.pageX;
                Mouse.y = e.clientY || e.pageY;
            }, false);
            element.addEventListener('mousedown', function (e) {
                if (e.button == 0) Mouse.LeftButton = true;
                if (e.button == 1) Mouse.MiddleButton = true;
                if (e.button == 2) Mouse.RightButton = true;
            }, false);
            element.addEventListener('mouseup', function (e) {
                if (e.button == 0) Mouse.LeftButton = false;
                if (e.button == 1) Mouse.MiddleButton = false;
                if (e.button == 2) Mouse.RightButton = false;
            }, false);
        }
    };

    //Mouse.AddEvents(document);
    return Mouse;
});