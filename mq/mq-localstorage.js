/**
 * A localStorage wrapper than serializes to / unserializes from JSON and
 *    adds a cache layer and a few useful extra methods.
 */

'use strict';
angular.module('mq-localstorage', [])

.value('mqLocalStoragePrefix', '')
.value('mqLocalStorageVersion', null)

.factory('mqLocalStorage', function(mqLocalStoragePrefix, mqLocalStorageVersion) {
  var prefix = mqLocalStoragePrefix;
  var cache = Object.create(null);
  var ls = localStorage;

  if (get('version') !== mqLocalStorageVersion) {
    ls.clear();
    set('version', mqLocalStorageVersion);
  }

  function has(key) {
    return key in cache;
  }

  function get(key, defaultValue) {
    if (!has(key)) {
      var value = ls.getItem(prefix + key);
      cache[key] = value != null ? JSON.parse(value) : defaultValue;
    }
    return cache[key];
  }

  function set(key, value) {
    ls.setItem(prefix + key, JSON.stringify(value));
    cache[key] = value;
  }

  function remove(key) {
    ls.removeItem(prefix + key);
    delete cache[key];
  }

  function getLength() {
    return ls.length;
  }

  function getKey(index) {
    var key = ls.key(index);
    return key ? key.substr(prefix.length) : null;
  }

  function getKeys() {
    var keys = [];
    for (var i = 0, len = ls.length; i < len; i++)
      keys.push(getKey(i));
    return keys;
  }

  function getBytes() {
    return JSON.stringify(cache).length;
  }

  function setPrefix(value) {
    prefix = value;
  }

  var clear = ls.clear.bind(ls);

  return {
    has: has,
    get: get,
    set: set,
    remove: remove,
    clear: clear,
    getLength: getLength,
    getKey: getKey,
    getKeys: getKeys,
    getBytes: getBytes,
    setPrefix: setPrefix,
  };
});
