/**
 * A simple signal emitter wrapped into angular
 */

'use strict';
angular.module('mq-emitter', [])

.factory('mqEmitter', function() {
  var proto = {

    init: function() {
      this._listeners = Object.create(null);
      return this;
    },

    on: function(signal, listener) {
      if (!this._listeners[signal])
        this._listeners[signal] = [];

      var list = this._listeners[signal];
      if (list.indexOf(listener) === -1)
        list.push(listener);
    },

    off: function(signal, listener) {
      var list = this._listeners[signal];
      if (!list) return;

      var index = list.indexOf(listener);
      if (index !== -1)
        list.splice(index, 1);
    },

    once: function(signal, listener) {
      var self = this;
      this.on(signal, function wrapper() {
        self.off(signal, wrapper);
        listener.apply(this, arguments);
      });
    },

    emit: function(signal /*, var_args*/) {
      var list = this._listeners[signal];
      if (!list) return;

      var args = Array.prototype.slice.call(arguments, 1);
      list.forEach(function(listener) {
        listener.apply(null, args);
      });
    }
  };

  function MqEmitter() { }
  MqEmitter.prototype = proto;

  return {
    proto: proto,
    new: function() {
      return new MqEmitter().init();
    }
  };
});
