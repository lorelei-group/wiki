define(function(require) {
  'use strict';
  var Set = require('mq/evented-set');
  var storage = require('./storage');

  var StoredSet = Object.create(Set);

  StoredSet.init = function(key, start) {
    Set.init.apply(this, arguments);
    this.on('change', function save(set) {
      storage.set(key, set.items);
    });
  };

  return StoredSet;
});
