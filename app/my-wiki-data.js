'use strict';

angular.module('my-wiki-data')

.factory('jsonp', function($http, $q) {
  return function jsonp(url, params) {
    var callback = 'my_jsonp' + Date.now() + Math.round(Math.random() * 100000);
    var deferred = $q.defer();
    params = params || {};
    params.callback = callback;

    window[callback] = function(response) {
      delete window[callback];
      deferred.resolve(response);
    };

    $http.jsonp(url, { params: params });
    return deferred.promise;
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

.factory('articles', function(storage, wikipedia) {
  function getIfExists(key) {
    var article = storage.get(key);
    update(article);
    return article;
  }

  function get(key) {
    var article = storage.get(key);
    update(article);
    download(article);
    return article;
  }

  function update(article) {
    article.onInbox = storage.inbox.has(article.key);
    article.archived = storage.archive.has(article.key);
    article.stored = article.onInbox || article.archived;
    return article;
  }

  function save(key) {
    key = key.key || key;
    storage.inbox.add(key);
    storage.archive.remove(key);
    var article = get(key);
    storage.save(article);
    return article;
  }

  function archive(article) {
    storage.inbox.remove(article.key);
    storage.archive.add(article.key);
    storage.save(article);
    return get(article.key);
  }

  function remove(article) {
    var key = article.key || article;
    storage.inbox.remove(key);
    storage.archive.remove(key);
    storage.remove(key);
  }

  var downloading = [];
  function download(article) {
    var key = article.key || article;
    var entry = storage.get(key);
    if (entry.content) return;

    downloading.push(key);
    wikipedia.article(key, 'es').then(function(result) {
      var content = result.text['*'].replace(/{{+([^}]*)}}+/g, '{-{$1}-}');
      entry.content = '<h1>' + result.title + '</h1>\n' + content;
      entry.title = result.title;
      storage.save(entry);
    }).finally(function() {
      var index = downloading.indexOf(key);
      downloading.splice(index, 1);
    });
  }

  return window.data = {
    getIfExists: getIfExists,
    get: get,
    update: update,
    save: save,
    archive: archive,
    remove: remove,
    inInbox: storage.inbox.items,
    inArchive: storage.archive.items,
    downloading: downloading,
  };
})

;
