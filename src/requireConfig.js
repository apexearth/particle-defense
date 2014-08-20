require.config({
    baseUrl: "",
    paths: {
        'angular': 'lib/angular.min',
        'domReady': 'lib/domReady'
    },
    shim: {
        angular: {
            exports: 'angular'
        }
    },
    waitSeconds: 15
});
