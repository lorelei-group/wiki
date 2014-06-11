define(function(require) {
  'use strict';
  require('../module')

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
  });
});
