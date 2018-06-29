'use strict';

(function () {

  var renderedPictures = [];

  var renderPictures = function (picturesArray, container) {
    var fragment = document.createDocumentFragment();
    picturesArray.forEach(function (item) {
      var pictureEl = window.createPicture(item);
      fragment.appendChild(pictureEl);
      renderedPictures.push(pictureEl);
    });
    container.appendChild(fragment);
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



