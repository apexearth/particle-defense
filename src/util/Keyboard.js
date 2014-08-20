define("util/Keyboard", function () {
    var Keyboard = {
        keys: new Array(),
        CheckKey: function (keyCode) {
            if (this.keys[keyCode] != undefined) return this.keys[keyCode];
            return false;
        }
    };
    document.onkeydown = function (event) {
        Keyboard.keys[event.keyCode] = true;
    };
    document.onkeyup = function (event) {
        Keyboard.keys[event.keyCode] = false;
    };

    Keyboard.Keys = {
        Shift: 16,
        Escape: 27
    };
    return Keyboard;
});