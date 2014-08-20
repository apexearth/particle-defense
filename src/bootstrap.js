require([
    'require',
    'angular',
    'app/App'
], function (require, ng) {
    'use strict';

    require(['domReady!',
        "app/IndexController",
        "app/MainMenuController",
        "app/GameUiController",
        "app/GameOverController"], function (document) {
        ng.bootstrap(document, ['ParticleDefense']);
    });
});