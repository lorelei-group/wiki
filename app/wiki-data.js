'use strict';

angular.module('wiki-data')

.factory('jsonp', function($http, $q) {
  return function jsonp(url, params) {
    params = params || {};
    params.callback = 'JSON_CALLBACK';

    return $http.jsonp(url, {
      params: params,
      timeout: 5000,
    }).then(function(result) {
      return result.data;
    });
  };
})

.factory('wikipedia', function(jsonp) {
  function getApiUrl(language) {
    return 'http://' + language + '.wikipedia.org/w/api.php';
  }

  function search(term, language) {
    return jsonp(getApiUrl(language), {
      action: 'opensearch',
      search: term
    }).then(function(results) {
      return results[1];
    });
  }

  function article(key, language) {
    return jsonp(getApiUrl(language), {
      action: 'parse',
      format: 'json',
      prop: 'text',
      page: key
    }).then(function(result) {
      if (result.error) throw result.error;
      var match = result.parse.text['*'].match(/<ol>\n<li>REDIRECT <a href="\/wiki\/([^"]+)/);
      if (match) return article(match[1], language);
      return result.parse;
    });
  }

  return {
    search: search,
    article: article,
  };
})

.factory('Set', function() {
  function Set(start) {
    this.items = [];
    this.keys = Object.create(null);
    this.map = this.items.map.bind(this.items);

    if (start)
      start.map(this.add.bind(this));
  }

  Set.prototype = {
    constructor: Set,

    add: function(key) {
      if (this.has(key)) return;
      this.keys[key] = true;
      this.items.push(key);
      this._onChange(this.items);
    },

    remove: function(key) {
      if (!this.has(key)) return;
      delete this.keys[key];
      var index = this.items.indexOf(key);
      this.items.splice(index, 1);
      this._onChange(this.items);
    },

    has: function(key) {
      return !!this.keys[key];
    },

    clear: function() {
      this.keys = {};
      this.items.length = 0;
    },

    _onChange: function() { },
  };

  return Set;
})

.factory('storage', function(Set) {
  function getFromStorage(key) {
    var value = localStorage[key];
    return value ? JSON.parse(value) : null;
  }

  var cache = Object.create(null);
  var inbox = new Set(getFromStorage('my-wiki|inbox'));
  var archive = new Set(getFromStorage('my-wiki|archive'));

  inbox._onChange = function(items) {
    localStorage['my-wiki|inbox'] = JSON.stringify(items);
  };
  archive._onChange = function(items) {
    localStorage['my-wiki|archive'] = JSON.stringify(items);
  };

  function get(key) {
    if (!(key in cache))
      cache[key] = getFromStorage('my-wiki|article|' + key) || { key: key };
    return cache[key];
  }

  function save(article) {
    var key = article.key;
    cache[key] = article;
    localStorage['my-wiki|article|' + key] = JSON.stringify(article);
  }

  function remove(article) {
    var key = article.key || article;
    delete cache[key];
    delete localStorage['my-wiki|article|' + key];
  }

  return {
    inbox: inbox,
    archive: archive,
    get: get,
    save: save,
    remove: remove,
  };
})

;
