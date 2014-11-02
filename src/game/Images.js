define('game/Images', function () {
    function getImage(src) {
        var image = new Image();
        image.src = src;
        return image;
    }

    return {
        Pixel: (function () {
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            var context = canvas.getContext("2d");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, 1, 1);
            return canvas;
        }())
    };
});
