'use strict';
angular.module('mq-timer', [])

.factory('mqTimer', function($timeout) {
  var proto = {

    init: function(action, duration) {
      this.duration = duration || 1000;
      this._tick = this._tick.bind(this);
      this._action = action;
      this._int = null;
      return this;
    },

    start: function() {
      if (this._int) return;
      this._int = $timeout(this._tick, this.duration);
    },

    stop: function() {
      if (!this._int) return;
      $timeout.cancel(this._int);
      this._int = null;
    },

    restart: function() {
      this.stop();
      this.start();
    },

    _tick: function() {
      this._int = null;
      this._action.call(null);
    }
  };

  function Timer() { }
  Timer.prototype = proto;

  return {
    proto: proto,
    new: function(action, duration) {
      return new Timer().init(action, duration);
    }
  };
})

.factory('mqRepeater', function(mqTimer) {
  var proto = Object.create(mqTimer.proto);
  proto._tick = function() {
    mqTimer.proto.apply(this, arguments);
    this.start();
  };

  function Repeater() { }
  Repeater.prototype = proto;

  return {
    proto: proto,
    new: function(action, duration) {
      return new Repeater().init(action, duration);
    }
  };
})

;
