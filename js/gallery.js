'use strict';

(function () {
  var picturesContainer = document.querySelector('.pictures');

  var renderPictures = function (picturesArray) {
    var fragment = document.createDocumentFragment();
    picturesArray.forEach(function (item) {
      fragment.appendChild(window.createPicture(item));
    });
    picturesContainer.appendChild(fragment);
  };

  var renderError = function (errorText) {
    var errorElement = document.createElement('p');
    errorElement.textContent = errorText;
    errorElement.style.position = 'absolute';
    errorElement.style.top = '190px';
    errorElement.style.left = '50%';
    errorElement.style.transform = 'translate(-50%)';
    errorElement.style.padding = '80px 130px';
    errorElement.style.boxShadow = '0 0 0 500px rgba(0,0,0,0.8)';
    errorElement.style.fontSize = '24px';
    errorElement.style.lineHeight = '34px';
    errorElement.style.textAlign = 'center';
    errorElement.style.textTransform = 'none';
    errorElement.style.color = 'red';
    errorElement.style.border = '3px solid red';
    errorElement.style.backgroundColor = 'beige';
    document.body.appendChild(errorElement);
  };

  window.backend.downloadData(renderPictures, renderError);
})();
