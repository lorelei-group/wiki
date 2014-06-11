define(function(require) {
  'use strict';
  require('../module')

  .directive('articleItem', function() {
    return { templateUrl: 'app/article-item.html' };
  });
});
