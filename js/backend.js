'use strict';

(function () {
  window.backend = {};
  window.backend.downloadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var url = 'https://js.dump.academy/kekstagram/data';
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Произошла ошибка ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения!  Пожалуйста, попробуйте позже');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('GET', url);

    xhr.send();
  };

  window.backend.upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var url = 'https://js.dump.academy/kekstagram';
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError();
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('POST', url);
    xhr.send(data);
  };
})();
