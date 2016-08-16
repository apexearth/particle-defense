var Mouse = module.exports = {
    x:             0,
    y:             0,
    LeftButton:    false,
    MiddleButton:  false,
    RightButton:   false,
    AddEvents:     function (element) {
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
    },
    /** @summary Callback function(delta) {} */
    AddWheelEvent: function (callback) {
        if (wheelEvents.indexOf(callback) === -1) wheelEvents.push(callback);
    }
};

/* MouseWheel Stuff */
var wheelEvents = [];
function wheelEvent(e) {
    var event = window.event || e;
    var delta = event.detail ? event.detail * (-120) : event.wheelDelta;
    var i     = wheelEvents.length;
    while (i--) wheelEvents[i](delta);
}
if(typeof navigator !== 'undefined') {
    var wheelEventName = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    if (document.attachEvent)
        document.attachEvent("on" + wheelEventName, wheelEvent);
    else if (document.addEventListener)
        document.addEventListener(wheelEventName, wheelEvent, false);
}
/* -------------- */
