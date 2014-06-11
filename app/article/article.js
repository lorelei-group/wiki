define(function(require) {
  'use strict';
  require('../module')

  .controller('ArticleCtrl', function($scope, $routeParams, $window, storage) {
    $scope.article = storage.articles.getAndDownload($routeParams.lang, $routeParams.article);
    $scope.toInbox = storage.toInbox;
    $scope.toArchive = storage.toArchive;
    $scope.remove = storage.articles.remove;
  });
});
