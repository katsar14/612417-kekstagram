'use strict';

(function () {
  var COMMENT_MAX_LENGTH = 140;
  var HASHTAGS_MAX_NUMBER = 5;
  var HASHTAG_MAX_LENGTH = 20;

  var showError = function (input, errorText) {
    input.style.borderColor = 'red';
    input.setCustomValidity(errorText);
  };

  var findDouble = function (array) {
    var newArr = array.map(function (item) {
      return item.toLowerCase();
    });
    newArr.sort();
    for (var i = 0; i < newArr.length - 1; i++) {
      if (newArr[i + 1] === newArr[i]) {
        return true;
      }
    }
    return false;
  };

  var findErrors = function (hashtagsArray) {
    var error = '';
    var errorsArray = [];

    if (hashtagsArray.length > HASHTAGS_MAX_NUMBER) {
      errorsArray.push('Нельзя указать больше пяти хэш-тегов');
    }
    if (findDouble(hashtagsArray)) {
      errorsArray.push('Один и тот же хэш-тег не может быть использован дважды');
    }
    hashtagsArray.forEach(function (hashtag) {
      if (hashtag.indexOf('#') !== 0) {
        error = 'Хэш-тег должен начинаться с символа # (решётка)';
        if (!errorsArray.includes(error)) {
          errorsArray.push(error);
        }
      }
      if (hashtag === '#') {
        error = 'Хеш-тег не может состоять только из одной решётки';
        if (!errorsArray.includes(error)) {
          errorsArray.push(error);
        }
      }
      if (hashtag.lastIndexOf('#') > 0) {
        error = 'Хэш-теги разделяются пробелами';
        if (!errorsArray.includes(error)) {
          errorsArray.push(error);
        }
      }
      if (hashtag.length > HASHTAG_MAX_LENGTH) {
        error = 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
        if (!errorsArray.includes(error)) {
          errorsArray.push(error);
        }
      }
    });
    return errorsArray;
  };

  var validateHashtags = function (input, text) {
    if (text) {
      var hashtags = text.trim().split(' ').filter(function (item) {
        return item !== '';
      });
      var errors = findErrors(hashtags);
      if (errors.length > 0) {
        showError(input, errors.join('! '));
      } else {
        input.setCustomValidity('');
        input.style.borderColor = '';
      }
    } else {
      input.setCustomValidity('');
      input.style.borderColor = '';
    }
  };

  var validateDescription = function (input, text) {
    if (text.length > COMMENT_MAX_LENGTH) {
      showError(input, 'Длина комментария не может составлять больше 140 символов');
    } else {
      input.setCustomValidity('');
      input.style.borderColor = '';
    }
  };

  window.validation = {
    validateHashtags: validateHashtags,
    validateDescription: validateDescription
  };

})();
