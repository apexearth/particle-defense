module.exports = {
    Pixel: (function () {
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        var context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 1, 1);
        return canvas;
    }())
};
