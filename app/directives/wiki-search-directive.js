define(function(require) {
  'use strict';
  require('../module')

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
  });
});
