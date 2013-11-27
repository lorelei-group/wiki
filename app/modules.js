'use strict';

angular.module('my-wiki', [
  'ngRoute',
  'my-wiki-articles',
  'my-wiki-href-patch',
]);

angular.module('my-wiki-articles', [
  'my-wiki-data',
]);

angular.module('my-wiki-data', []);
angular.module('my-wiki-href-patch', []);
