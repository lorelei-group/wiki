define(function(require) {
  'use strict';
  require('notifications/notifications');
  require('archive/archive');
  require('article/article');
  require('inbox/inbox');
  require('./module')

  .config(function($routeProvider) {
    $routeProvider
      .when('/inbox', {
        templateUrl: 'app/inbox.html',
        controller: 'InboxCtrl'
      })
      .when('/archive', {
        templateUrl: 'app/archive.html',
        controller: 'ArchiveCtrl'
      })
      .when('/wiki/:lang/:article', {
        templateUrl: 'app/article.html',
        controller: 'ArticleCtrl'
      })
      .otherwise({
        redirectTo: '/inbox'
      });
  });

  angular.bootstrap(document, [ 'mq-wiki' ]);
});
