'use strict';
angular.module('mq-wiki')

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
})

.controller('ArticleCtrl', function($scope, $routeParams, $window, storage) {
  $scope.article = storage.articles.getAndDownload($routeParams.lang, $routeParams.article);
  $scope.toInbox = storage.toInbox;
  $scope.toArchive = storage.toArchive;
  $scope.remove = storage.articles.remove;
})

.controller('ArchiveCtrl', function($scope, storage) {
  function sync(values) {
    $scope.articles = values.map(storage.articles.getById);
  }

  storage.archive.on('change', sync);
  sync(storage.archive);

  $scope.toInbox = storage.toInbox;
  $scope.remove = storage.articles.remove;
})

.controller('InboxCtrl', function($scope, mqLocalStorage, storage) {
  function sync(values) {
    $scope.articles = values.map(storage.articles.getById);
  }

  storage.inbox.on('change', sync);
  sync(storage.inbox);

  $scope.toInbox = storage.toInbox;
  $scope.toArchive = storage.toArchive;
  $scope.remove = storage.articles.remove;

  $scope.lang = mqLocalStorage.get('lang') || 'es';
  $scope.$watch('lang', mqLocalStorage.get.bind(null, 'lang'));
})

.controller('NotificationsCtrl', function($scope, articles) {
  function key(id) {
    return id.split('|')[1];
  }

  $scope.pending = articles.pending.map(key);
  articles.pending.on('change', function(value) {
    $scope.pending = value.map(key);
  });

  $scope.downloading = articles.downloading.map(key);
  articles.downloading.on('change', function(value) {
    $scope.downloading = value.map(key);
  });

  $scope.empty = function(type) {
    console.log('clearing', type);
    articles[type].clear();
    console.log(articles[type].items.length);
  };
})

;
