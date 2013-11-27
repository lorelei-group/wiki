'use strict';

angular.module('wiki-articles')

.factory('download', function($timeout, $rootScope, Set, storage, wikipedia) {
  var interval;
  var storedPending = localStorage['my-wiki|pending'];
  var pending = new Set(storedPending ? JSON.parse(storedPending) : null);
  var downloading = new Set();

  window.pending = $rootScope.pendingDownloads = pending.items;
  window.downloading = $rootScope.downloading = downloading.items;

  var timer = {
    start: function() {
      if (interval) this.stop();
      interval = $timeout(this.tick, 1000);
    },
    stop: function() {
      $timeout.cancel(interval);
      interval = null;
    },
    tick: function() {
      var items = pending.items.slice();
      pending.clear();
      items.map(download);
    }
  };

  timer.tick.bind(timer);
  pending._onChange = function(value) {
    localStorage['my-wiki|pending'] = JSON.stringify(value);
    timer[value.length ? 'start' : 'stop']();
  };

  window.addEventListener('online',  timer.tick);
  if (window.onLine)
    timer.tick();

  function download(entry) {
    var key = entry.key || entry;
    entry = storage.get(key);
    if (entry.content) return;

    if (!navigator.onLine)
      return pending.add(key);

    downloading.add(key);
    wikipedia.article(key, 'es').then(function(result) {
      var content = result.text['*'].replace(/{{+([^}]*)}}+/g, '{-{$1}-}');
      entry.content = '<h1>' + result.title + '</h1>\n' + content;
      entry.title = result.title;
      storage.save(entry);
    }, function() {
      pending.add(key);
    }).finally(function() {
      downloading.remove(key);
    });
  }

  return download;
})

.factory('articles', function(Set, storage, download) {
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

  return window.data = {
    getIfExists: getIfExists,
    get: get,
    update: update,
    save: save,
    archive: archive,
    remove: remove,
    inInbox: storage.inbox.items,
    inArchive: storage.archive.items,
  };
})

;
