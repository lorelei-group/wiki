define(function(require) {
  'use strict';
  var DomStorage = require('mq/dom-storage');

  return DomStorage.new({
    prefix: 'mq-wiki|',
    version: 0,
  });
});
