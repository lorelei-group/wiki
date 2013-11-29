'use strict';

angular.module('mq-wiki', [
  'ngTouch',
  'ngRoute',
  'mq-wiki-storage',
  'mq-wiki-wikipedia',
  'mq-wiki-directives',
]);

angular.module('mq-wiki-storage', [
  'mq-wiki-set',
  'mq-wiki-articles',
]);

angular.module('mq-wiki-articles', [
  'mq-set',
  'mq-timer',
  'mq-wiki-set',
  'mq-wiki-wikipedia',
]);

angular.module('mq-wiki-set', [
  'mq-set',
  'mq-localstorage',
]);

angular.module('mq-wiki-directives', [
  'ngTouch'
]);

angular.module('mq-wiki-wikipedia', []);

angular.module('mq-localstorage')
  .value('mqLocalStoragePrefix', 'mq-wiki|')
  .value('mqLocalStorageVersion', 1);
