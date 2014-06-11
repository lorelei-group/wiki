requirejs.config({
  baseUrl: 'app/',

  paths: {
    'angular-core': '../bower_components/angular/angular.js',
    'angular-route': '../bower_components/angular-route/angular-route.js',
    'angular': '../bower_components/angular-touch/angular-touch.js',
    'http-request': '../bower_components/http-request/http-request.js',
    'mq': '../bower_components/mq/src',
  },

  shim: {
    'angular-route': [ 'angular-core' ],
    'angular': {
      deps: [ 'angular-core' ],
      exports: 'angular',
    },
    'http-request': {
      exports: 'HttpRequest',
    }
  }

})(['app']);
