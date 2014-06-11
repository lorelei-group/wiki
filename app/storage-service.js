define(function(require) {
  'use strict';
  require('./module')

  .factory('storage', function(storedSet, articles) {
    function move(list, value) {
      return function(key) {
        var article = articles.getById(key);
        article[list] = value;
        article.stored = article.onInbox || article.onArchive;
      };
    }

    var inbox = storedSet('inbox');
    var archive = storedSet('archive');

    inbox.on('add', move('onInbox', true));
    inbox.on('remove', move('onInbox', false));
    archive.on('add', move('onArchive', true));
    archive.on('remove', move('onArchive', false));

    function update(article) {
      article.onInbox = inbox.has(article.id);
      article.onArchive = archive.has(article.id);
      article.stored = article.onInbox || article.onArchive;
      return article;
    }

    function getById(id) {
      return update(articles.getById(id));
    }
    function get(language, key) {
      return update(articles.get(language, key));
    }

    function getAndDownload(language, key) {
      articles.download(language, key);
      return get(language, key);
    }

    function remove(article) {
      var id = article.id || article;
      inbox.remove(id);
      archive.remove(id);
      articles.remove(id);
    }

    function toInbox(article) {
      var id = article.id || article;
      article = getById(id);
      inbox.add(id);
      archive.remove(id);
      return getAndDownload(article.lang, article.key);
    }

    function toArchive(article) {
      var id = article.id || article;
      article = getById(id);
      inbox.remove(id);
      archive.add(id);
      return getAndDownload(article.lang, article.key);
    }

    return window.data = {
      inbox: inbox,
      archive: archive,
      toInbox: toInbox,
      toArchive: toArchive,
      articles: {
        getById: getById,
        getAndDownload: getAndDownload,
        get: get,
        remove: remove,
      },
    };
  });
});
