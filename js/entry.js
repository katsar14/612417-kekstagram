'use strict';

(function () {
  var loadData = new Event('loadData');

  document.addEventListener('DOMContentLoaded', function () {
    var renderError = function (errorText) {
      var errorElement = document.createElement('p');
      errorElement.textContent = errorText;
      errorElement.classList.add('download-error-message');
      document.body.appendChild(errorElement);
    };

    window.backend.downloadData(function (response) {
      window.data.set(response);
      document.dispatchEvent(loadData);
    }, renderError);
  });

  document.addEventListener('loadData', function (evt) {
    evt.preventDefault;
    var picturesContainer = document.querySelector('.pictures');
    window.gallery.render(window.data.get(), picturesContainer);
    window.filters.show(window.data.get(), picturesContainer);
  });

})();
