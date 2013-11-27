'use strict';

angular.module('wiki', [
  'ngRoute',
  'wiki-articles',
  'wiki-href-patch',
]);

angular.module('wiki-articles', [
  'wiki-data',
]);

angular.module('wiki-data', []);
angular.module('wiki-href-patch', []);
