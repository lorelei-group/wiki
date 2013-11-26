'use strict';

angular.module('my-wiki', [
  'ngRoute',
  'my-wiki-data',
  'my-wiki-href-patch',
]);

angular.module('my-wiki-data', [
  'firebase',
]);

angular.module('my-wiki-href-patch', []);
