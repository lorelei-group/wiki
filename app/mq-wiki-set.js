'use strict';
angular.module('mq-wiki-set')

.factory('storedSet', function(mqSet, mqLocalStorage) {
  return function(key) {
    var set = mqSet.new(mqLocalStorage.get(key));
    set.on('change', mqLocalStorage.set.bind(mqLocalStorage, key));
    return set;
  };
})

;
