/**
 * A collection than guarantees not repeated entries. Only strings are allowed.
 * You can watch for modifications asigning the "onChange" property to a listener.
 */

'use strict';
angular.module('mq-set', [
  'mq-emitter',
])

.factory('mqSet', function(mqEmitter) {
  function wrap(property, method) {
    return function() {
      return this[property][method].apply(this[property], arguments);
    };
  }

  function emitRemove(key) {
    // this is a private method so it can use 'this'
    //jshint validthis:true
    this.emitter.emit('Remove', key);
  }

  var proto = {

    get length() {
      return this.items.length;
    },

    init: function(start) {
      this.items = [];
      this._keys = Object.create(null);
      this.emitter = mqEmitter.new();

      if (start)
        start.forEach(this.add.bind(this));

      return this;
    },

    has: function(key) {
      return key in this._keys;
    },

    add: function(key) {
      if (typeof key !== 'string')
        throw new Error('Set() only accepts strings as key');

      if (this.has(key)) return;
      this.items.push(key);
      this._keys[key] = true;
      this.emitter.emit('change', this.items);
      this.emitter.emit('add', key);
    },

    remove: function(key) {
      if (!this.has(key)) return;

      var index = this.items.indexOf(key);
      this.items.splice(index, 1);
      delete this._keys[key];
      this.emitter.emit('change', this.items);
      this.emitter.emit('remove', key);
    },

    clear: function() {
      var items = this.items.slice();
      this.items.length = 0;
      this._keys = Object.create(null);
      this.emitter.emit('change', this.items);
      items.map(emitRemove, this);
    },

    // Delegate array methods
    join: wrap('items', 'join'),
    slice: wrap('items', 'slice'),
    concat: wrap('items', 'concat'),

    // Delegate array extras
    map: wrap('items', 'map'),
    some: wrap('items', 'some'),
    every: wrap('items', 'every'),
    filter: wrap('items', 'filter'),
    reduce: wrap('items', 'reduce'),
    forEach: wrap('items', 'forEach'),
    reduceRight: wrap('items', 'reduceRight'),

    // Delegate emitter
    on: wrap('emitter', 'on'),
    off: wrap('emitter', 'off'),
    once: wrap('emitter', 'once'),
  };

  function Set() {}
  Set.prototype = proto;

  return {
    proto: proto,
    new: function(start) {
      return new Set().init(start);
    }
  };
});
