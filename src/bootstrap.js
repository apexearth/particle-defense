require([
    'require',
    'angular',
    'app/app'
], function (require, ng) {
    'use strict';

    require(['domReady!',
        "app/index",
        "app/mainmenu",
        "app/gameui",
        "app/gameover"], function (document) {
        ng.bootstrap(document, ['app']);
    });
});