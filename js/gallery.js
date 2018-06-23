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

  renderPictures(window.pictures);
})();
