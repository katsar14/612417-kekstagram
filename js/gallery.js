'use strict';

(function () {

  var picturesContainer = document.querySelector('.pictures');

  var renderedPictures = [];

  var renderPictures = function (picturesArray) {
    var fragment = document.createDocumentFragment();
    picturesArray.forEach(function (item) {
      var pictureEl = window.picture.createPicture(item);
      fragment.appendChild(pictureEl);
      renderedPictures.push(pictureEl);
    });
    picturesContainer.appendChild(fragment);
  };

  window.gallery = {
    render: renderPictures,
    clear: function () {
      renderedPictures.forEach(function (item) {
        item.remove();
      });
      renderedPictures = [];
    }
  };
})();
