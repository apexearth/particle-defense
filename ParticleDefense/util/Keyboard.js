function Keyboard() {
    this.keys = new Array();
    document.onkeydown = this.keyDown;
    document.onkeyup = this.keyUp;
}

Keyboard.prototype.keyDown = function (event) {
    Keyboard.keys[event.keyCode] = true;
};
Keyboard.prototype.keyUp = function (event) {
    Keyboard.keys[event.keyCode] = false;
};

var Keyboard = new Keyboard();