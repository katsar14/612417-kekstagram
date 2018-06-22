'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.utils = {
    isEscEvent: function (evt, callback) {
      if (evt.keyCode === ESC_KEYCODE) {
        callback();
      }
    },
    isEnterEvent: function (evt, callback) {
      if (evt.keyCode === ENTER_KEYCODE) {
        callback();
      }
    },
    getRandomInteger: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    }
  };
})();
