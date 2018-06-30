'use strict';

(function () {
  var photos = null;
  window.data = {
    get: function () {
      return photos;
    },
    set: function (newPhotos) {
      photos = newPhotos;
    }
  };
})();
