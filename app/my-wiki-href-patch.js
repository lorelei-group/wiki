'use strict';

angular.module('my-wiki-href-patch')

.directive('href', function($compile) {
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var href = attrs.href;
      var key;

      if (href.indexOf('/w/index.php?title=') === 0)
        attrs.$set('href', '');

      if (href.indexOf('/wiki/') === 0) {
        key = decodeURIComponent(href.substr(6));
        attrs.$set('onclick', 'return false');
        attrs.$set('fake-ng-click', 'save(\'' + key + '\')');
      }

      return function(scope, iElement) {
        if (key) {
          iElement[0].addEventListener('click', function(event) {
            scope.save(key);
            event.stopPropagation();
          });
        }
      };
    }
  };
})

.directive('compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(function(scope) {
      return scope.$eval(attrs.compile);
    }, function(value) {
      element.html(value);
      $compile(element.contents())(scope);
    });
  };
})

;
