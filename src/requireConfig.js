require.config({
    baseUrl: "",
    paths: {
        'jasmine': 'lib/jasmine-1.3.1/jasmine',
        'jasmine-html': 'lib/jasmine-1.3.1/jasmine-html',
        'angular': 'lib/angular.min',
        'angular-mocks': 'lib/angular-mocks',
        'domReady': 'lib/domReady'
    },
    shim: {
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        angular: {
            exports: 'angular'
        },
        'angular-mocks': {
            deps: ['jasmine', 'angular'],
            exports: 'angular.mock'
        }
    },
    waitSeconds: 15
});
