var General = module.exports = {}

if(typeof navigator !== "undefined") {
    General.is_chrome   = navigator.userAgent.indexOf('Chrome') > -1;
    General.is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    General.is_firefox  = navigator.userAgent.indexOf('Firefox') > -1;
    General.is_safari   = (General.is_chrome && navigator.userAgent.indexOf("Safari") > -1 ? false : navigator.userAgent.indexOf("Safari") > -1);
    General.is_Opera    = navigator.userAgent.indexOf("Presto") > -1;
}
General.CopyTo = function (from, to) {
    for (var a in from) {
        to[a] = from[a];
    }
    return to;
};

General.NestedCopyTo = function (from, to, ignoreArray) {
    if (null == from
        || "object" != typeof from
        || (typeof HTMLCanvasElement !== 'undefined' && from instanceof HTMLCanvasElement)
    ) return from;
    if (to == null) to = from.constructor();
    for (var o in from) {
        if (from.hasOwnProperty(o)
            && (ignoreArray === undefined || ignoreArray.indexOf(from[o]) == -1)) {
            to[o] = General.NestedCopyTo(from[o], to[o]);
        }
    }
    return to;
};
