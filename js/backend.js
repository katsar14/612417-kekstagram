'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  window.backend = {};
  window.backend.downloadData = function (onLoad, onError) {
    loadData(onLoad, onError, DOWNLOAD_URL, 'GET');
  };

  window.backend.upload = function (onLoad, onError, data) {
    loadData(onLoad, onError, UPLOAD_URL, 'POST', data);
  };

  var loadData = function (onLoad, onError, url, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Произошла ошибка соединения!  Пожалуйста, попробуйте позже');
      }
    });

    xhr.addEventListener('error', function () {
      onError();
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, url);
    xhr.send(data);
  };

})();
