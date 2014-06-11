define(function(require) {
  'use strict';

  function request(method, url, data) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);

      xhr.addEventListener('readystatechange', function(event) {
        if (xhr.readystate === 4)
          resolve(xhr.responseText);
      });

      xhr.send(typeof data === 'string' ? data : null);
    });
  }

  function addGetParams(url, params) {
    var separator = url.indexOf('?') !== -1 ? '&' : '?';
    var getParams = Object.keys(params).map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    });
    return url + separator + getParams.join('&');
  }



  var callbackIndex = 0;
  function jsonp(url, params, options) {
    return new Promise(function(resolve, reject) {
      params = params || {};
      callbackIndex++;
      var callback = '__mq_callback__' + callbackIndex;

      params.callback = callback;
      var script = addGetParams(url, params);

      var tag = document.createElement('script');
      tag.setAttribute('type', 'text/javascript');
      tag.setAttribute('src', script);
      document.head.appendChild(tag);

      window[callback] = function(response) {
        delete window[callback];
        document.head.removeChild(tag);
        resolve(response);
      };

      if (options && options.timeout)
        setTimeout(reject, options.timeout);
    });
  }



  function get(url, params) {
    return request('GET', addGetParams(url, params));
  }
  function post(url, data) {
    return request('POST', url, JSON.stringify(data));
  }



  request.get = get;
  request.post = post;
  request.jsonp = jsonp;
  return request;
});
