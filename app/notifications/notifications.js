define(function(require) {
  'use strict';
  require('../module')

  .controller('NotificationsCtrl', function($scope, $window, articles) {
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

    $scope.reload = function() {
      $window.location.reload();
    };
  });
});
