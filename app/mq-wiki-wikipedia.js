'use strict';
angular.module('mq-wiki-wikipedia', [])

.factory('wikipedia', function($http) {
  function getApiUrl(language) {
    return 'http://' + language + '.wikipedia.org/w/api.php';
  }

  function jsonp(language, params) {
    params.callback = 'JSON_CALLBACK';
    return $http.jsonp(getApiUrl(language), {
      params: params,
      timeout: 5000,
    });
  }

  function search(language, term) {
    return jsonp(language, {
      action: 'opensearch',
      search: term
    }).then(function(response) {
      return response.data[1];
    });
  }

  function article(language, key) {
    return jsonp(language, {
      action: 'parse',
      format: 'json',
      prop: 'text',
      page: key
    }).then(function(response) {
      var data = response.data;
      if (data.error) throw data.error;

      // If it is a redirection page...
      var match = data.parse.text['*'].match(/<ol>\n<li>[^ ]+ <a href="\/wiki\/([^"]+)/);
      if (match) return article(language, decodeURIComponent(match[1]));

      return data.parse;
    });
  }

  return {
    search: search,
    article: article,
  };
});
