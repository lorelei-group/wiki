define(function(require) {
  'use strict';
  require('../module')

  .controller('ArchiveCtrl', function($scope, storage) {
    function sync(values) {
      $scope.articles = values.map(storage.articles.getById);
    }

    storage.archive.on('change', sync);
    sync(storage.archive);

    $scope.toInbox = storage.toInbox;
    $scope.remove = storage.articles.remove;
  });
});
