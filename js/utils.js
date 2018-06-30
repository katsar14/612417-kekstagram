'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.utils = {
    isEscEvent: function (evt, callback) {
      if (evt.keyCode === ESC_KEYCODE) {
        callback();
      }
    },

    getRandomInteger: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    shuffle: function (arr, startIndex) {
      for (var i = 0; i < startIndex; i++) {
        var currentIndex = window.utils.getRandomInteger(0, i);
        var interimIndex = arr[currentIndex];
        arr[currentIndex] = arr[i];
        arr[i] = interimIndex;
      }
      return arr;
    }
  };
})();
