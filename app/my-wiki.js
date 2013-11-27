'use strict';

angular.module('my-wiki')

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
    .when('/wiki/:article', {
      templateUrl: 'app/article.html',
      controller: 'ArticleCtrl'
    })
    .otherwise({
      redirectTo: '/inbox'
    });
})

.controller('ArticleCtrl', function($scope, $routeParams, $window, articles) {
  var article = articles.get($routeParams.article);
  $scope.article = article;
  $scope.save = articles.save;
  $scope.archive = articles.archive;
  $scope.delete = articles.remove;

  $scope.$watch('downloading', function(value) {
    console.log('watch fired', value);
  }, true);

  $scope.back = function() {
    $window.history.back();
  };
})

.controller('ArchiveCtrl', function($scope, articles) {
  $scope.list = articles.inArchive;
  $scope.$watch('list', function(value) {
    if (!value) return;
    $scope.articles = value.map(articles.get);
  }, true);

  $scope.save = articles.save;
  $scope.delete = articles.delete;
})

.controller('InboxCtrl', function($scope, articles, wikipedia) {
  window.caca = $scope.list = articles.inInbox;
  $scope.$watch('list', function(value) {
    console.log('watch fired');
    if (!value) return;
    $scope.articles = value.map(articles.get);
  }, true);

  $scope.save = articles.save;
  $scope.delete = articles.remove;
  $scope.archive = articles.archive;

  $scope.$watch('term', function(value) {
    if (!value) {
      $scope.results = null;
    } else {
      wikipedia.search(value, 'es').then(function(results) {
        $scope.results = results.map(articles.getIfExists);
      });
    }
  });

  window.scope = $scope;
})

.directive('articleItem', function() {
  return {
    template:
      '<a ng-href="#/wiki/{{ article.key }}">{{ article.title || article.key }}</a>' +
      '<button ng-show="article.stored" ng-click="delete(article)">Delete</button>' +
      '<button ng-show="!article.archived" ng-click="archive(article)">Archive</button>' +
      '<button ng-show="!article.onInbox" ng-click="save(article)">Inbox</button>' +
      '<div class="clearfix"></div>'
  };
})

;
