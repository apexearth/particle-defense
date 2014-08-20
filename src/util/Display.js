define("util/Display", ["util/Mouse", "util/Keyboard"], function (Mouse, Keyboard) {
    function Display() {
    }

    Mouse.DisplayX = 0;
    Mouse.DisplayY = 0;

    Display.canvas = null;
    Display.context = null;
    Display.canvasList = [];
    Display.centerX = 400;
    Display.centerY = 300;
    Display.drawOffsetX = 0;
    Display.drawOffsetY = 0;
    Display.drawScale = 1;
    Display.drawOffsetXT = 0;
    Display.drawOffsetYT = 0;
    Display.drawScaleT = 1;
    Display.panning = false;

    Display.arcCircle = 2 * Math.PI;

    Display.Settings = function () {
    };
    Display.Settings.FpsTarget = 30;
    Display.Settings.DisableTranslation = false;
    Display.Settings.DisableQuality = function () {
        if (Display.Settings.Quality !== 1)
            Display.Settings._quality = Display.Settings.Quality;
        Display.Settings.Quality = 1;
    };
    Display.Settings.EnableQuality = function () {
        Display.Settings.Quality = Display.Settings._quality;
    };
    Display.Settings.InverseQuality = function () {
        Display.Settings.Quality = 1 / Display.Settings.Quality;
    };
    Display.Settings.Quality = 1;


    Display.initialize = function (canvas) {
        if (canvas == null) return;
        Display.canvas = canvas;
        Display.context = canvas.getContext("2d");
        Display.canvasList['Main'] = canvas;
        Display.setDrawCanvas('Main');
        var scroll = function (event) {
            if (event.wheelDelta > 0 || event.detail < 0) {
                Display.drawOffsetXT += (Display.centerX - event.clientX) * .1 / Display.drawScale;
                Display.drawOffsetYT += (Display.centerY - event.clientY) * .1 / Display.drawScale;
                Display.zoomIn();
            } else {
                Display.drawOffsetXT += (Display.centerX - event.clientX) * .1 / Display.drawScale;
                Display.drawOffsetYT += (Display.centerY - event.clientY) * .1 / Display.drawScale;
                Display.zoomOut();
            }
        };
        if (window.chrome) {
            document.onmousewheel = scroll;
        }
        if (document.attachEvent)
            document.attachEvent("onmousewheel", scroll);
        else
            window.addEventListener("DOMMouseScroll", scroll, false);


        canvas.onmousedown = function (event) {
            if (event.button != 0) {
                Display.panning = true;
                Display.px = event.clientX;
                Display.py = event.clientY;
            }
            return false;
        };
        canvas.onmouseup = function (event) {
            if (event.button != 0)
                Display.panning = false;
        };
        canvas.onmousemove = function (event) {
            if (Display.panning == true) {
                Display.drawOffsetXT -= (Display.px - event.clientX) / Display.drawScale;
                Display.drawOffsetYT -= (Display.py - event.clientY) / Display.drawScale;
                Display.px = event.clientX;
                Display.py = event.clientY;
            }
        };
        canvas.oncontextmenu = canvas.ondblclick = function () {
            window.focus();
            return false;
        };
        document.onmousedown = function () {
            window.focus();
            //return false;
        };
        window.onresize = function () {
            Display.setCanvasSize();
        };

        Display.setCanvasSize();
    };
    Display.setDrawCanvas = function (canvasName) {
        Display.drawCanvas = Display.canvasList[canvasName];
        Display.drawContext = Display.drawCanvas.getContext('2d');
    };
    Display.createDrawCanvas = function (canvasName, width, height) {
        Display.drawCanvas = Display.canvasList[canvasName] = document.createElement("canvas");
        Display.drawCanvas.width = width * Display.Settings.Quality;
        Display.drawCanvas.height = height * Display.Settings.Quality;
        Display.drawContext = Display.drawCanvas.getContext('2d');
        return Display.drawCanvas;
    };
    Display.createExternalDrawCanvas = function (width, height) {
        Display.drawCanvas = document.createElement("canvas");
        Display.drawCanvas.width = width * Display.Settings.Quality;
        Display.drawCanvas.height = height * Display.Settings.Quality;
        Display.drawContext = Display.drawCanvas.getContext('2d');
        return Display.drawCanvas;
    };
    Display.setCenterXY = function () {
        Display.centerX = Display.canvas.width / 2;
        Display.centerY = Display.canvas.height / 2;
    };
    Display.setCanvasSize = function () {
        Display.canvas.width = window.innerWidth;
        Display.canvas.height = window.innerHeight;
        Display.setCenterXY();
    };
    Display.getImage = function () {
        return Display.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    };

    Display.zoomOut = function (speed) {
        Display.drawScaleT *= 1 - (0.1 * (speed != null ? speed : 1));
    };
    Display.zoomIn = function (speed) {
        Display.drawScaleT /= 1 - (0.1 * (speed != null ? speed : 1));
    };
    Display.translateCoordinate = function (x, y) {
        if (Display.Settings.DisableTranslation) return {
            "x": x * Display.Settings.Quality,
            "y": y * Display.Settings.Quality
        };
        return {
            "x": Display.centerX + Display.drawScale * (x + Display.drawOffsetX),
            "y": Display.centerY + Display.drawScale * (y + Display.drawOffsetY)
        };
    };
    Display.inverseTranslateCoordinate = function (x, y) {
        if (Display.Settings.DisableTranslation) return {
            "x": x / Display.Settings.Quality,
            "y": y / Display.Settings.Quality
        };
        return {
            "x": (x - Display.centerX) / Display.drawScale - Display.drawOffsetX,
            "y": (y - Display.centerY) / Display.drawScale - Display.drawOffsetY
        };
    };
    Display.translateScale = function (s) {
        if (Display.Settings.DisableTranslation) return s * Display.Settings.Quality;
        return s * Display.drawScale * Display.Settings.Quality;
    };
    Display.getDrawScale = function () {
        return Display.drawScale * Display.Settings.Quality;
    };

// Drawing
    Display.setFill = function (color) {
        Display.drawContext.fillStyle = color;
    };
    Display.setStroke = function (color) {
        Display.drawContext.strokeStyle = color;
    };
    Display.clear = function () {
        Display.drawContext.clearRect(0, 0, Display.drawCanvas.width, Display.drawCanvas.height);
    };
    Display.drawImage = function (image, x, y) {
        var translation = Display.translateCoordinate(x, y);
        Display.drawContext.drawImage(image, translation.x, translation.y, Display.translateScale(image.width), Display.translateScale(image.height));
    };
    Display.fillRect = function (x, y, w, h) {
        var translation = Display.translateCoordinate(x, y);
        var translateW = Display.translateScale(w);
        var translateH = Display.translateScale(h);
        Display.drawContext.fillRect(translation.x, translation.y, translateW, translateH);
    };
    Display.strokeRect = function (x, y, w, h) {
        var translation = Display.translateCoordinate(x, y);
        var translateW = Display.translateScale(w);
        var translateH = Display.translateScale(h);
        Display.drawContext.strokeRect(translation.x, translation.y, translateW, translateH);
    };
    Display.drawPolygon = function (coordsx, coordsy) {
        if (!coordsx || coordsx.length == 0) return;
        var i = 0;
        Display.drawContext.beginPath();
        Display.drawContext.moveTo(coordsx[i], coordsy[i]);
        for (i = 1; i < coordsx.length; i++) {
            context.lineTo(coordsx[i], coordsy[i]);
        }
        Display.drawContext.lineTo(coordsx[0], coordsy[0]);
        Display.drawContext.closePath();
        Display.drawContext.fill();
    };
    Display.fillCircle = function (x, y, radius) {
        var translation = Display.translateCoordinate(x, y);
        var translateRadius = Display.translateScale(radius);
        Display.drawContext.beginPath();
        Display.drawContext.arc(translation.x, translation.y, translateRadius, 0, this.arcCircle, false);
        Display.drawContext.closePath();
        Display.drawContext.fill();
    };
    Display.strokeCircle = function (x, y, radius) {
        var translation = Display.translateCoordinate(x, y);
        var translateRadius = Display.translateScale(radius);
        Display.drawContext.beginPath();
        Display.drawContext.arc(translation.x, translation.y, translateRadius, 0, this.arcCircle, false);
        Display.drawContext.closePath();
        Display.drawContext.stroke();
    };

// Font Related
    Display.strokeText = function (text, x, y) {
        var translation = Display.translateCoordinate(x, y);
        Display.drawContext.strokeText(text, translation.x, translation.y);
    };
    Display.fillText = function (text, x, y) {
        var translation = Display.translateCoordinate(x, y);
        Display.drawContext.fillText(text, translation.x, translation.y);
    };
    Display.setFont = function (fontSize, fontType) {
        Display.drawContext.font = Display.Settings.Quality * fontSize + 'px ' + fontType;
    };

    Display.update = function () {
        Display.setCenterXY();

        if (Keyboard.keys[187] || Keyboard.keys[107] || Keyboard.keys[61]) {
            Display.zoomIn(0.2);
        } else if (Keyboard.keys[189] || Keyboard.keys[109] || Keyboard.keys[173]) {
            Display.zoomOut(0.2);
        }

        Display.updateDrawOffset();
        Display.updateDrawScale();

        var mouseDisplayCoords = Display.inverseTranslateCoordinate(Mouse.X, Mouse.Y);
        Mouse.DisplayX = mouseDisplayCoords.x;
        Mouse.DisplayY = mouseDisplayCoords.y;
    };

    Display.updateDrawScale = function () {
        if (Display.drawScale != Display.drawScaleT) {
            var drawScaleChange = (Display.drawScaleT - Display.drawScale) * 0.2;
            Display.drawScale += drawScaleChange;
            if (Math.abs(Display.drawScale - Display.drawScaleT) < .001) Display.drawScale = Display.drawScaleT;
        }
    };

    Display.updateDrawOffset = function () {
        if (Keyboard.keys[37])
            Display.drawOffsetXT += 10 / Display.drawScale;
        if (Keyboard.keys[38])
            Display.drawOffsetYT += 10 / Display.drawScale;
        if (Keyboard.keys[39])
            Display.drawOffsetXT -= 10 / Display.drawScale;
        if (Keyboard.keys[40])
            Display.drawOffsetYT -= 10 / Display.drawScale;

        if (Display.drawOffsetX != Display.drawOffsetXT || Display.drawOffsetY != Display.drawOffsetYT) {
            Display.drawOffsetX += ((Display.drawOffsetXT - Display.drawOffsetX) * 0.25);
            Display.drawOffsetY += ((Display.drawOffsetYT - Display.drawOffsetY) * 0.25);
            if (Math.abs(Display.drawOffsetX - Display.drawOffsetXT) < .1) Display.drawOffsetX = Display.drawOffsetXT;
            if (Math.abs(Display.drawOffsetY - Display.drawOffsetYT) < .1) Display.drawOffsetY = Display.drawOffsetYT;
        }
    };
    return Display;
});