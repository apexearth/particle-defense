define("Settings", ["../util/Display"], function (Display) {
    return {
        BlockSize: 35,
        Second: 1000 / Display.Settings.FpsTarget
    };
});