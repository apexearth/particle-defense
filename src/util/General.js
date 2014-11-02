define("util/General", ["pixi"], function (PIXI) {
    function General() {
    }

    General.is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    General.is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    General.is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    General.is_safari = (General.is_chrome && navigator.userAgent.indexOf("Safari") > -1 ? false : navigator.userAgent.indexOf("Safari") > -1);
    General.is_Opera = navigator.userAgent.indexOf("Presto") > -1;

    General.CopyTo = function (from, to) {
        for (var a in from) { to[a] = from[a]; }
        return to;
    };

    General.NestedCopyTo = function (from, to, ignoreArray) {
        if (null == from
            || "object" != typeof from
            || from instanceof HTMLCanvasElement
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
    General.mobilecheck = function () {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    General.normalize = function (x1, y1, x2, y2) {
        var dirx = x2 - x1;
        var diry = y2 - y1;
        var hyp = Math.sqrt(dirx * dirx + diry * diry);
        dirx /= hyp;
        diry /= hyp;
        if (isNaN(dirx)) dirx = 0;
        if (isNaN(diry)) diry = 0;
        return {x: dirx, y: diry};
    };
    General.AngleRad = function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    };
    General.Angle = function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    };
    General.LeadingAngleRad = function (x1, y1, speed1, x2, y2, x2v, y2v) {
        var a = Math.pow(x2v, 2) + Math.pow(y2v, 2) - Math.pow(speed1, 2);
        var b = 2 * (x2v * (x2 - x1) + y2v * (y2 - y1));
        var c = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
        var disc = Math.pow(b, 2) - 4 * a * c;
        var t1 = (-b + Math.sqrt(disc)) / (2 * a);
        var t2 = (-b - Math.sqrt(disc)) / (2 * a);
        var t = (t1 < t2 && t1 > 0 ? t1 : t2);
        if (isNaN(t)) return General.AngleRad(x1, y1, x2, y2);
        var aimTargetX = t * x2v + x2;
        var aimTargetY = t * y2v + y2;
        return General.AngleRad(x1, y1, aimTargetX, aimTargetY);
    };

    General.LeadingVector = function (x1, y1, speed1, x2, y2, x2v, y2v) {
        var a = Math.pow(x2v, 2) + Math.pow(y2v, 2) - Math.pow(speed1, 2);
        var b = 2 * (x2v * (x2 - x1) + y2v * (y2 - y1));
        var c = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
        var disc = Math.pow(b, 2) - 4 * a * c;
        var t1 = (-b + Math.sqrt(disc)) / (2 * a);
        var t2 = (-b - Math.sqrt(disc)) / (2 * a);
        var t = (t1 < t2 && t1 > 0 ? t1 : t2);
        if (isNaN(t)) return General.AngleRad(x1, y1, x2, y2);
        var aimTargetX = t * x2v + x2;
        var aimTargetY = t * y2v + y2;
        return {x: aimTargetX, y: aimTargetY};
    };

    General.Distance = function (x, y) {
        return Math.sqrt(Math.abs((x * x) + (y * y)));
    };
    General.DistanceSq = function (x, y) {
        return Math.abs((x * x) + (y * y));
    };
    General.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    General.Point = PIXI.Point;
    General.Vector2 = function (x, y) {
        this.x = x;
        this.y = y;
    };
    General.Vector2.create = function (x, y) {
        return new Vector2(x, y);
    };
    return General;
});