'use strict';

(function () {
  var uploadForm = document.querySelector('#upload-select-image');
  var overlay = uploadForm.querySelector('.img-upload__overlay');
  var cancelButton = uploadForm.querySelector('#upload-cancel');
  var sizeControlsBlock = uploadForm.querySelector('.resize');
  var decreaseControl = sizeControlsBlock.querySelector('.resize__control--minus');
  var increaseControl = sizeControlsBlock.querySelector('.resize__control--plus');
  var pictureUploaded = uploadForm.querySelector('.img-upload__preview');
  var scale = uploadForm.querySelector('.scale');
  var scaleLevel = scale.querySelector('.scale__level');
  var pin = scale.querySelector('.scale__pin');
  var hashtagInput = uploadForm.hashtags;
  var description = uploadForm.description;

  var INITIAL_FILTER = 'heat';
  var currentFilterClass = 'effects__preview--' + INITIAL_FILTER;
  var INITIAL_EFFECT_LEVEL = 100;
  var filterName;


  var showUploadForm = function () {
    overlay.classList.remove('hidden');
    document.addEventListener('keydown', formEscPressHandler);
    pictureUploaded.classList.add(currentFilterClass);
    setEffectLevel(INITIAL_FILTER, INITIAL_EFFECT_LEVEL);
    filterName = INITIAL_FILTER;
    pin.addEventListener('mousedown', pinMouseDownHandler);

    uploadForm.addEventListener('change', formChangeHandler);

    sizeControlsBlock.addEventListener('click', sizeControlsClickHandler);

    cancelButton.addEventListener('click', function () {
      hideUploadForm();
    });

    hashtagInput.addEventListener('input', hashtagInputHandler);
    description.addEventListener('input', descriptionInputHandler);

    uploadForm.addEventListener('submit', uploadFormSubmitHandler);
  };

  var hashtagInputHandler = function (evt) {
    var target = evt.target;
    window.validation.validateHashtags(target, target.value);
  };

  var descriptionInputHandler = function (evt) {
    var target = evt.target;
    window.validation.validateDescription(target, target.value);
  };

  var hideUploadForm = function () {
    overlay.classList.add('hidden');
    uploadForm.reset();
    document.removeEventListener('keydown', formEscPressHandler);
    uploadForm.removeEventListener('change', formChangeHandler);
    sizeControlsBlock.removeEventListener('click', sizeControlsClickHandler);
    hashtagInput.removeEventListener('click', hashtagInputHandler);
    description.removeEventListener('click', descriptionInputHandler);
    pin.removeEventListener('mousedown', pinMouseDownHandler);
    uploadForm.removeEventListener('submit', uploadFormSubmitHandler);
    pictureUploaded.style.transform = 'scale(1)';
  };

  var formEscPressHandler = function (evt) {
    if (evt.target === description) {
      window.utils.isEscEvent(evt, function () {
        evt.stopPropagation();
      });
    } else {
      window.utils.isEscEvent(evt, hideUploadForm);
    }
  };

  // изменение размеров изображения

  var sizeControlsClickHandler = function (evt) {
    if (evt.target === increaseControl) {
      increaseSize(uploadForm.scale, pictureUploaded);
    }
    if (evt.target === decreaseControl) {
      decreaseSize(uploadForm.scale, pictureUploaded);
    }
  };

  var increaseSize = function (inputEl, pictureEl) {
    var num = parseInt(inputEl.value.slice(0, inputEl.value.length - 1), 10);
    if (num < 100) {
      num += 25;
      pictureEl.style.transform = 'scale(' + num / 100 + ')';
    }
    inputEl.value = num + '%';
  };

  var decreaseSize = function (inputEl, pictureEl) {
    var num = parseInt(inputEl.value.slice(0, inputEl.value.length - 1), 10);
    if (num > 25) {
      num -= 25;
      pictureEl.style.transform = 'scale(' + num / 100 + ')';
    }
    inputEl.value = num + '%';
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
    if (effect === 'none') {
      pictureUploaded.style.filter = '';
    } else {
      var value = effectsMap[effect].minValue + (effectsMap[effect].maxValue - effectsMap[effect].minValue) * (coord / 100);
      var filter = effectsMap[effect].effect + '(' + value + effectsMap[effect].unit + ')';
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
    setEffectLevel(target.value, INITIAL_EFFECT_LEVEL);
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

  var onImgUpload = function () {
    hideUploadForm();
  };

  var onUploadError = function () {
    var errorTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--error');
    var errorElement = errorTemplate.cloneNode(true);
    overlay.appendChild(errorElement);
    errorElement.style.zIndex = '1000';
    errorElement.style.position = 'fixed';
    errorElement.classList.remove('hidden');
  };


  var uploadFormSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(uploadForm), onImgUpload, onUploadError);
  };

  var pinMouseDownHandler = function (evt) {
    evt.preventDefault();
    var MIN_COORD = 0;
    var MAX_COORD = 100;
    var scaleStart = pin.parentElement.getBoundingClientRect().left + pageXOffset + pin.offsetWidth / 2;
    var scaleWidth = pin.parentElement.offsetWidth;
    var startCoord = evt.clientX - scaleStart;

    var pinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoord - (moveEvt.clientX - scaleStart);
      var coordX = ((startCoord - pin.offsetWidth / 2 - shift) * 100 / scaleWidth);
      if (coordX > MIN_COORD && coordX <= MAX_COORD) {
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
