'use strict';

var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var PHOTO_COUNT = 25;

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var commentTemplate = document.querySelector('#picture').content.querySelector('.social__comment');
var picturesContainer = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var commentsList = bigPicture.querySelector('.social__comments');


var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

var shuffle = function (arr, startIndex) {
  for (var i = 0; i < startIndex; i++) {
    var currentIndex = getRandomInteger(0, i);
    var interimIndex = arr[currentIndex];
    arr[currentIndex] = arr[i];
    arr[i] = interimIndex;
  }
  return arr;
};

var getRandomArr = function (target, length) {
  var arr = target.slice();
  shuffle(arr, arr.length);
  return arr.slice(0, length);
};

var generatePhotoObj = function (num, comments, descriptions) {
  return {
    url: 'photos/' + num + '.jpg',
    likes: getRandomInteger(15, 200),
    comments: getRandomArr(comments),
    description: descriptions[getRandomInteger(0, descriptions.length - 1)]
  };
};

var generatePhotoList = function () {
  var pictures = [];
  for (var i = 1; i <= PHOTO_COUNT; i++) {
    pictures.push(generatePhotoObj(i, COMMENTS, DESCRIPTIONS));
  }
  return pictures;
};

var pictures = generatePhotoList();

var createPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

  pictureElement.addEventListener('click', function () {
    renderBigPicture(picture);
  });

  return pictureElement;
};

var renderPictures = function (picturesArray) {
  var fragment = document.createDocumentFragment();
  picturesArray.forEach(function (item) {
    fragment.appendChild(createPicture(item));
  });
  picturesContainer.appendChild(fragment);
};

var createComment = function (commentText) {
  var commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('.social__picture').src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
  commentElement.appendChild(document.createTextNode(commentText));
  return commentElement;
};

var renderCommentsList = function (comments) {
  commentsList.innerHTML = '';
  var fragment = document.createDocumentFragment();
  comments.forEach(function (comment) {
    fragment.appendChild(createComment(comment));
  });
  commentsList.appendChild(fragment);
};

var renderBigPicture = function (picture) {
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  renderCommentsList(picture.comments);
  bigPicture.querySelector('.social__caption').textContent = picture.description;
  hideCounters();
  bigPicture.addEventListener('click', function (evt) {
    if (evt.target.id === 'picture-cancel') {
      bigPicture.classList.add('hidden');
    }
  });
  bigPicture.classList.remove('hidden');
};

var hideCounters = function () {
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
};

renderPictures(pictures);


var uploadForm = document.querySelector('#upload-select-image');
var overlay = uploadForm.querySelector('.img-upload__overlay');
var cancelButton = uploadForm.querySelector('#upload-cancel');
var decreaseControl = uploadForm.querySelector('.resize__control--minus');
var increaseControl = uploadForm.querySelector('.resize__control--plus');
var pictureUploaded = uploadForm.querySelector('.img-upload__preview');
var scale = uploadForm.querySelector('.scale');
var scaleLevel = scale.querySelector('.scale__level');
var pin = scale.querySelector('.scale__pin');

var initialFilter = 'heat';
var currentFilterClass = 'effects__preview--' + initialFilter;


var showUploadForm = function () {
  overlay.classList.remove('hidden');
  document.addEventListener('keydown', documentEscPressHandler);
  pictureUploaded.classList.add(currentFilterClass);
  pin.style.left = '100%';
  setEffectLevel(initialFilter, pictureUploaded);
  uploadForm.addEventListener('change', formChangeHandler);
  pin.addEventListener('mouseup', function () {
    setEffectLevel(initialFilter, pictureUploaded);
  });
  increaseControl.addEventListener('click', function () {
    increaseSize(uploadForm['scale'], pictureUploaded);
  });
  decreaseControl.addEventListener('click', function () {
    decreaseSize(uploadForm['scale'], pictureUploaded);
  });
  cancelButton.addEventListener('click', function () {
    hideUploadForm();
  });
};

var hideUploadForm = function () {
  overlay.classList.add('hidden');
  document.removeEventListener('keydown', documentEscPressHandler);
  uploadForm.reset();
  uploadForm.removeEventListener('change', formChangeHandler);
};

var documentEscPressHandler = function (evt) {
  if (evt.keyCode === 27) {
    overlay.classList.add('hidden');
  }
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

var setEffectLevel = function (effect, picture) {
  scaleLevel.style.width = pin.style.left;
  var level = parseInt(pin.style.left.slice(0, pin.style.left.length - 1), 10);
  uploadForm['effect-level'].value = level;
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
    pin.style.left = '100%';
    setEffectLevel(target.value, pictureUploaded);

    pin.addEventListener('mouseup', function () {
      setEffectLevel(target.value, pictureUploaded);
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


//
//
//
//
//
// Валидация

// var hashtagInput = uploadForm.querySelector('.text__hashtags');
// var description = uploadForm.querySelector('.text__description');

// var showError = function (input, errorText) {
//   input.style.borderColor = 'red';
//   input.setCustomValidity(errorText);
// }

// var findDouble = function (array) {
//   var newArr = array.map(function(item) {
//       return item.toLowerCase();
//     }
//   );
//   console.log(newArr)
//   newArr.sort()
//   for (var i = 0; i < newArr.length-1; i++) {
//     if (newArr[i+1] == newArr[i]) {
//       return true
//     }
//   }
//   return false
// };


// var validateHashtags = function (input, text) {
//   if (text) {
//   var hashtags = text.trim().split(' ').filter(function(item){
//     return item !== '';
//   });
//   var error = '';
//   var errors = []
//   if (hashtags.length > 5) {
//     errors.push('Нельзя указать больше пяти хэш-тегов');
//   }
//   if (findDouble(hashtags)) {
//     errors.push('Один и тот же хэш-тег не может быть использован дважды');
//   }
//   hashtags.forEach(function (hashtag) {
//       if (hashtag.indexOf('#') !== 0) {
//         error = 'Хэш-тег должен начинаться с символа # (решётка)'
//         if (!errors.includes(error)) {errors.push(error)}
//     } else if (hashtag === "#") {
//         error = 'Хеш-тег не может состоять только из одной решётки';
//         if (!errors.includes(error)) {
//          errors.push(error);
//         }
//     } else if (hashtag.lastIndexOf('#') !== 0) {
//       error =  'Хэш-теги разделяются пробелами';
//       if (!errors.includes(error)) {
//         errors.push(error)
//       }
//     } else if (hashtag.length > 20) {
//       error = 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
//       if (!errors.includes(error)) {
//         errors.push(error);
//       }
//     }
//   })
//   if (errors.length > 0) {
//   showError(input, errors.join(' '));
//   }
//   else {
//     input.setCustomValidity('');
//     input.style.borderColor = '';
//   }
// }};

// uploadForm.addEventListener('invalid', function (evt) {
//       evt.preventDefault;
// }, true);

// hashtagInput.addEventListener('input', function (evt) {
//   var target = evt.target;
//   console.log(target.value)
//   validateHashtags(target, target.value);
// });

// description.addEventListener('keydown', function (evt) {
//   if (evt.keyCode === 27) {
//     evt.stopPropagation();
//   }
// })
