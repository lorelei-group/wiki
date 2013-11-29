'use strict';
angular.module('mq-wiki-directives')

.directive('wikiContent', function() {
  return function(scope, elem, attrs) {
    var element = elem[0];
    var map = Array.prototype.map;

    scope.$watch(function(scope) {
      return scope.$eval(attrs.wikiContent);
    }, function(value) {
      var lang = element.getAttribute('lang');
      element.innerHTML = value || 'Cargando...';

      map.call(element.querySelectorAll('[href^="/w/index.php?title="]'), function(child) {
        child.removeAttribute('href');
      });

      map.call(element.querySelectorAll('[href^="/wiki/"]'), function(child) {
        function onInteract(event) {
          scope.toInbox(id);
          event.preventDefault();
          event.stopPropagation();
        }

        var key = decodeURIComponent(child.getAttribute('href').substr(6));
        var id = lang + '|' + key;

        child.setAttribute('fake-ng-click', 'save(\'' + id + '\')');
        child.addEventListener('click', onInteract);
        child.addEventListener('touchend', onInteract);
      });
    });
  };
})

.directive('wikisearch', function(storage, wikipedia) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr) {
      var key = attr.ngModel;
      var results = attr.wikisearch;
      var lang = attr.wikisearchLang;
      var lastSearch;

      function search() {
        var value = scope[key];
        lastSearch = value;

        if (!value) {
          scope[results] = null;
          return;
        }

        wikipedia.search(scope[lang], value).then(function(response) {
          if (value === lastSearch)
            scope[results] = response.map(storage.articles.get.bind(null, scope.lang));
        });
      }

      scope.$watch(key, search);
      scope.$watch(lang, search);
    }
  };
})

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
})

.directive('articleItem', function() {
  return { templateUrl: 'app/article-item.html' };
})

;
