define(function(require) {
  'use strict';
  require('../module')

  .directive('mqNotification', function() {
    return {
      templateUrl: 'app/notification.html',
      scope: {
        list: '=mqNotification',
        name: '@mqNotification',
        message: '@',
        onSwipe: '&',
      }
    };
  });
});
