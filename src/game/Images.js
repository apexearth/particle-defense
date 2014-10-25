define('game/Images', function () {
    function getImage(src) {
        var image = new Image();
        image.src = src;
        return image;
    }

    return{
        test: getImage("http://www.clker.com/cliparts/7/i/M/9/J/4/smiling-baby-small-md.png")
    };
});
