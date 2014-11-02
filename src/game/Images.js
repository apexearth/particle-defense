define('game/Images', function () {
    function getImage(src) {
        var image = new Image();
        image.src = src;
        return image;
    }

    return{
        test: getImage("")
    };
});
