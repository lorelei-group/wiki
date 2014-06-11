define(function(require) {
  'use strict';
  require('../module')

  .directive('wikiContent', function(ngClickDirective) {
    var ngClick = ngClickDirective[0];
    return function(scope, elem, attrs) {
      var element = elem[0];
      var map = Array.prototype.forEach;

      scope.onLink = function(id) {
        scope.toInbox(id);
        event.preventDefault();
        event.stopPropagation();
      };

      scope.$watch(function(scope) {
        return scope.$eval(attrs.wikiContent);
      }, function(value) {
        var showImages = 'wikiShowImages' in attrs;
        var lang = element.getAttribute('lang');
        var fragment = document.createDocumentFragment();
        var container = fragment.appendChild(document.createElement('div'));
        container.innerHTML = value || '';

        if (!showImages)
          angular.element(fragment.querySelectorAll('img')).remove();
        angular.element(fragment.querySelectorAll('[href^="/w/index.php?title="]')).removeAttr('href');

        map.call(fragment.querySelectorAll('[href^="/wiki/"]'), function(child) {
          var key = decodeURIComponent(child.getAttribute('href').substr(6));
          var id = lang + '|' + key;

          var action = 'onLink(\'' + id.replace('\'', '\\\'') + '\')';
          child.setAttribute('ng-click', action);

          // HACK: We don't want to compile the full document because it can have
          //     angular-like html, so we invoke just ngClick over the element.
          //     element.on('click') does not work with touch.
          ngClick.compile(child)(scope, angular.element(child), { ngClick: action });
        });

        element.appendChild(fragment);
      });
    };
  });
});
