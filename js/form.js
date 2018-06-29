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
  var filterName;

  var showUploadForm = function () {
    overlay.classList.remove('hidden');
    document.addEventListener('keydown', formEscPressHandler);
    pictureUploaded.classList.add(currentFilterClass);
    setEffectLevel(initialFilter, initialEffectLevel);
    filterName = initialFilter;
    pin.addEventListener('mousedown', pinMouseDownHandler);

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
      minValue: 0,
      maxValue: 1,
      unit: ''
    },
    'sepia': {
      effect: 'sepia',
      minValue: 0,
      maxValue: 1,
      unit: ''
    },
    'marvin': {
      effect: 'invert',
      minValue: 0,
      maxValue: 100,
      unit: '%'
    },
    'phobos': {
      effect: 'blur',
      minValue: 0,
      maxValue: 3,
      unit: 'px'
    },
    'heat': {
      effect: 'brightness',
      minValue: 1,
      maxValue: 3,
      unit: ''
    }
  };

  var setEffectLevel = function (effect, coord) {
    uploadForm['effect-level'].value = coord;
    pin.style.left = coord + '%';
    scaleLevel.style.width = coord + '%';
    var level = coord;
    if (effect === 'none') {
      pictureUploaded.style.filter = '';
    } else {
      var value = effectsMap[effect].minValue + (effectsMap[effect].maxValue - effectsMap[effect].minValue) * (coord / 100);
      var filter = effectsMap[effect].effect + '(' + value + effectsMap[effect].unit +')';
      pictureUploaded.style.filter = filter;
    }
  };

  var applyEffect = function (target) {
    pictureUploaded.classList.remove(currentFilterClass);
    var filter = 'effects__preview--' + target.value;
    if (target.value === 'none') {
      scale.classList.add('hidden');
      pin.removeEventListener('mousedown', pinMouseDownHandler);
    } else {
      if (scale.classList.contains('hidden')) {
        scale.classList.remove('hidden');
      }
      filterName = target.value;
      pin.addEventListener('mousedown', pinMouseDownHandler);
    }
    pictureUploaded.classList.add(filter);
    currentFilterClass = filter;
    setEffectLevel(target.value, initialEffectLevel);
  };

  var formChangeHandler = function (evt) {
    evt.preventDefault();
    var target = evt.target;
    if (target.type === 'radio') {
      applyEffect(target);
    }
  };

  uploadForm['filename'].addEventListener('change', function () {
    showUploadForm();
  });

  var onLoad = function () {
    hideUploadForm();
  };

  var onError = function () {
    var errorTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--error');
    var errorElement = errorTemplate.cloneNode(true);
    overlay.appendChild(errorElement);
    errorElement.style.zIndex = '1000';
    errorElement.style.position = 'fixed';
    errorElement.classList.remove('hidden');
  };

  uploadForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(uploadForm), onLoad, onError);
    evt.preventDefault();
  });


  var pinMouseDownHandler = function (evt) {
    evt.preventDefault();
    var scaleStart = pin.parentElement.getBoundingClientRect().left + pageXOffset + pin.offsetWidth / 2;
    var scaleWidth = pin.parentElement.offsetWidth;
    var startCoord = evt.clientX - scaleStart;

    var pinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoord - (moveEvt.clientX - scaleStart);
      var coordX = ((startCoord - pin.offsetWidth / 2 - shift) * 100 / scaleWidth);
      if (coordX > 0 && coordX <= 100) {
        setEffectLevel(filterName, coordX);
        startCoord = moveEvt.clientX - scaleStart;
      }
    };

    var pinMouseUpHandler = function () {
      document.removeEventListener('mousemove', pinMouseMoveHandler);
      document.removeEventListener('mouseup', pinMouseUpHandler);
    };

    document.addEventListener('mousemove', pinMouseMoveHandler);
    document.addEventListener('mouseup', pinMouseUpHandler);
  };
})();
