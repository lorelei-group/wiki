define(function(require) {
  'use strict';
  require('../module')

  .factory('articles', function(mqLocalStorage, mqTimer, mqSet, storedSet, wikipedia) {
    var downloading = mqSet.new();
    var pending = storedSet('pending');
    var timer = mqTimer.new(retryDownloads, 10 * 1000);

    function retryDownloads() {
      if (!pending.length) return;
      // if it's downloading schedule again
      if (downloading.length > 1)
        return timer.start();

      // download the first items only
      pending.slice(0, 4).map(function(id) {
        pending.remove(id);
        download(id);
      });
    }

    pending.on('change', function(value) {
      timer[value.length ? 'restart' : 'stop']();
    });

    window.addEventListener('online', retryDownloads);
    retryDownloads();


    function sanitize(result) {
      var content = result.text['*'].replace(/{{+([^}]*)}}+/g, '{-{$1}-}');
      return '<h1>' + result.title + '</h1>\n' + content;
    }

    function download(language, key) {
      var entry = key ? getArticle(language, key) : getById(language);
      var id = entry.id;
      if (entry.content) return;

      downloading.add(id);

      wikipedia.article(entry.lang, entry.key).then(function(result) {
        entry.title = result.title;
        entry.content = sanitize(result);
        setArticle(entry);
        retryDownloads();
      }, function() {
        pending.add(id);
      }).finally(function() {
        downloading.remove(id);
      });
    }

    var prefix = 'article|';

    function getById(id) {
      var split = id.split('|');
      return getArticle(split[0], split[1]);
    }

    function getArticle(language, key) {
      var id = language + '|' + key;
      return mqLocalStorage.get(prefix + id, {
        id: id,
        lang: language,
        key: key,
        onInbox: false,
        onArchive: false,
      });
    }

    function setArticle(article) {
      mqLocalStorage.set(prefix + article.id, article);
    }

    function removeArticle(language, key) {
      var id = language.id || (language + '|' + key);
      mqLocalStorage.remove(prefix + id);
    }

    return {
      getById: getById,
      get: getArticle,
      set: setArticle,
      remove: removeArticle,
      download: download,
      pending: pending,
      downloading: downloading,
    };
  });
});
