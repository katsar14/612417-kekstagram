'use strict';

(function () {
  var uploadForm = document.querySelector('#upload-select-image');
  var overlay = uploadForm.querySelector('.img-upload__overlay');
  var cancelButton = uploadForm.querySelector('#upload-cancel');
  var decreaseControl = uploadForm.querySelector('.resize__control--minus');
  var increaseControl = uploadForm.querySelector('.resize__control--plus');
  var pictureUploaded = uploadForm.querySelector('.img-upload__preview');
  var scale = uploadForm.querySelector('.scale');
  var scaleLevel = scale.querySelector('.scale__level');
  var pin = scale.querySelector('.scale__pin');
  var hashtagInput = uploadForm.hashtags;

  var initialFilter = 'heat';
  var currentFilterClass = 'effects__preview--' + initialFilter;
  var initialEffectLevel = 100;

  var showUploadForm = function () {
    overlay.classList.remove('hidden');
    document.addEventListener('keydown', formEscPressHandler);
    pictureUploaded.classList.add(currentFilterClass);
    setEffectLevel(initialFilter, initialEffectLevel, pictureUploaded);

    pin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      var scaleStart = pin.parentElement.getBoundingClientRect().left + pageXOffset + pin.offsetWidth / 2;
      var scaleWidth = pin.parentElement.offsetWidth;
      var startCoord = evt.clientX - scaleStart;

      var mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();
        var shift = startCoord - (moveEvt.clientX - scaleStart);
        var coordX = ((startCoord - pin.offsetWidth / 2 - shift) * 100 / scaleWidth);
        if (coordX > 0 && coordX <= 100) {
          setEffectLevel(initialFilter, coordX, pictureUploaded);
          startCoord = moveEvt.clientX - scaleStart;
        }
      };

      var pinMouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', pinMouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', pinMouseUpHandler);
    });

    uploadForm.addEventListener('change', formChangeHandler);
    increaseControl.addEventListener('click', function () {
      increaseSize(uploadForm['scale'], pictureUploaded);
    });
    decreaseControl.addEventListener('click', function () {
      decreaseSize(uploadForm['scale'], pictureUploaded);
    });
    cancelButton.addEventListener('click', function () {
      hideUploadForm();
    });
    hashtagInput.addEventListener('input', function (evt) {
      var target = evt.target;
      window.validateHashtags(target, target.value);
    });
    uploadForm.description.addEventListener('keydown', function (evt) {
      window.utils.isEscEvent(evt, function () {
        evt.stopPropagation();
      });
    });
  };

  var hideUploadForm = function () {
    overlay.classList.add('hidden');
    uploadForm.reset();
    document.removeEventListener('keydown', formEscPressHandler);
    uploadForm.reset();
    uploadForm.removeEventListener('change', formChangeHandler);
  };

  var formEscPressHandler = function (evt) {
    window.utils.isEscEvent(evt, hideUploadForm);
  };

  // изменение размеров изображения

  var increaseSize = function (inputEl, pictureEl) {
    var num = parseInt(inputEl.value.slice(0, inputEl.value.length - 1), 10);
    if (num < 100) {
      num += 25;
      pictureEl.style.transform = 'scale(' + num / 100 + ')';
    }
    uploadForm['scale'].value = num + '%';
  };

  var decreaseSize = function (inputEl, pictureEl) {
    var num = parseInt(inputEl.value.slice(0, inputEl.value.length - 1), 10);
    if (num > 25) {
      num -= 25;
      pictureEl.style.transform = 'scale(' + num / 100 + ')';
    }
    uploadForm['scale'].value = num + '%';
  };

  // Применение эффекта для изображения

  var effectsMap = {
    'chrome': {
      effect: 'grayscale',
      delta: 1,
      delta2: 0,
      unit: ''
    },
    'sepia': {
      effect: 'sepia',
      delta: 1,
      delta2: 0,
      unit: ''
    },
    'marvin': {
      effect: 'invert',
      delta: 100,
      delta2: 0,
      unit: '%'
    },
    'phobos': {
      effect: 'blur',
      delta: 3,
      delta2: 0,
      unit: 'px'
    },
    'heat': {
      effect: 'brightness',
      delta: 2,
      delta2: 1,
      unit: ''
    }
  };

  var setEffectLevel = function (effect, coord, picture) {
    uploadForm['effect-level'] = coord;
    pin.style.left = coord + '%';
    scaleLevel.style.width = coord + '%';
    var level = coord;
    if (effect === 'none') {
      picture.style.filter = '';
    } else {
      var filter = effectsMap[effect].effect + '(' + (level / 100 * effectsMap[effect].delta + effectsMap[effect].delta2) + effectsMap[effect].unit + ')';
      picture.style.filter = filter;
    }
  };

  var applyEffect = function (target) {
    if (target.type === 'radio') {
      pictureUploaded.classList.remove(currentFilterClass);
      var filter = 'effects__preview--' + target.value;
      if (target.value === 'none') {
        scale.classList.add('hidden');
      } else {
        if (scale.classList.contains('hidden')) {
          scale.classList.remove('hidden');
        }
      }
      pictureUploaded.classList.add(filter);
      currentFilterClass = filter;
      setEffectLevel(target.value, initialEffectLevel, pictureUploaded);

      pin.addEventListener('mousedown', function (evt) {
        evt.preventDefault();

        var scaleStart = pin.parentElement.getBoundingClientRect().left + pageXOffset + pin.offsetWidth / 2;
        var scaleWidth = pin.parentElement.offsetWidth;
        var startCoord = evt.clientX - scaleStart;

        var mouseMoveHandler = function (moveEvt) {
          moveEvt.preventDefault();

          var shift = startCoord - (moveEvt.clientX - scaleStart);
          var coordX = ((startCoord - pin.offsetWidth / 2 - shift) * 100 / scaleWidth);
          if (coordX > 0 && coordX <= 100) {
            setEffectLevel(target.value, coordX, pictureUploaded);
            startCoord = moveEvt.clientX - scaleStart;
          }
        };

        var pinMouseUpHandler = function () {
          document.removeEventListener('mousemove', mouseMoveHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', pinMouseUpHandler);
      });
    }
  };

  var formChangeHandler = function (evt) {
    evt.preventDefault();
    var target = evt.target;
    applyEffect(target);
  };

  uploadForm['filename'].addEventListener('change', function () {
    showUploadForm();
  });
})();
