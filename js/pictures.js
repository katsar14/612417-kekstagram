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
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  renderCommentsList(picture.comments);
  bigPicture.querySelector('.social__caption').textContent = picture.description;
};

var hideCounters = function () {
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
};

renderPictures(pictures);
hideCounters();

var uploadInput = document.querySelector('#upload-file');
var uploadForm = document.querySelector('.img-upload__overlay');
var cancelButton = uploadForm.querySelector('#upload-cancel');
var decreaseControl = uploadForm.querySelector('.resize__control--minus');
var increaseControl = uploadForm.querySelector('.resize__control--plus');
var resizeInput = uploadForm.querySelector('.resize__control--value');
var pictureUploaded = uploadForm.querySelector('.img-upload__preview');

var filters = uploadForm.querySelectorAll('.effects__radio');
var scale = uploadForm.querySelector('.scale');
var scaleLevel = scale.querySelector('.scale__level');
var scaleValue = scale.querySelector('.scale__value');
var pin = scale.querySelector('.scale__pin');
var activeFilter = uploadForm.querySelector('.effects__radio:checked');

var pictureLinks = document.querySelectorAll('.picture__link');
var closeBtn = bigPicture.querySelector('#picture-cancel');

// Загрузка изображения и показ формы редактирования

var showElem = function (elem) {
  elem.classList.remove('hidden');
};

var documentEscPressHandler = function (evt) {
  if (evt.keyCode === 27) {
    hideElem(uploadForm);
  }
};

var showUploadForm = function () {
  showElem(uploadForm);
  document.addEventListener('keydown', documentEscPressHandler);
  applyEffect(activeFilter);
  setEffectLevel(activeFilter, pictureUploaded);
  pin.addEventListener('mouseup', function () {
    setEffectLevel(activeFilter, pictureUploaded);
  });
};

var hideElem = function (elem) {
  elem.classList.add('hidden');
};

var hideUploadForm = function () {
  hideElem(uploadForm);
  document.removeEventListener('keydown', documentEscPressHandler);
};

// Редактирование размера изображения

var getNumberFromInput = function (inputString) {
  return parseInt(inputString.slice(0, inputString.length - 1), 10);
};

var increaseSize = function (inputEl, pictureEl) {
  var num = getNumberFromInput(inputEl.value);
  if (num < 100) {
    num += 25;
    pictureEl.style.transform = 'scale(' + num / 100 + ')';
  }
  return num + '%';
};

var decreaseSize = function (inputEl, pictureEl) {
  var num = getNumberFromInput(inputEl.value);
  if (num > 25) {
    num -= 25;
    pictureEl.style.transform = 'scale(' + num / 100 + ')';
  }
  return num + '%';
};

// Применение эффекта для изображения

var setEffectLevel = function (effect, picture) {
  scaleLevel.style.width = pin.style.left;
  var level = getNumberFromInput(pin.style.left);
  scaleValue.value = level;
  if (effect.value === 'none') {
    picture.style.filter = '';
  } else if (effect.value === 'chrome') {
    picture.style.filter = 'grayscale(' + level / 100 + ')';
  } else if (effect.value === 'sepia') {
    picture.style.filter = 'sepia(' + level / 100 + ')';
  } else if (effect.value === 'marvin') {
    picture.style.filter = 'invert(' + level + '%)';
  } else if (effect.value === 'phobos') {
    picture.style.filter = 'blur(' + level * 3 / 100 + 'px)';
  } else if (effect.value === 'heat') {
    picture.style.filter = 'brightness(' + (level * 2 / 100 + 1) + ')';
  }
};

var applyEffect = function (effect) {
  var effectClass = 'effects__preview--' + effect.value;
  pictureUploaded.className = 'img-upload__preview ' + effectClass;
  pin.style.left = '100%';
  scaleLevel.style.width = '100%';
  scaleValue.value = '100';
  if (effect.value === 'none') {
    scale.classList.add('hidden');
  } else {
    scale.classList.remove('hidden');
  }
};

// ОБработчики событий

uploadInput.addEventListener('change', function () {
  showUploadForm();
});

cancelButton.addEventListener('click', function () {
  hideUploadForm();
});

cancelButton.addEventListener('keydown', function (evt) {
  if (evt.target === 13) {
    hideUploadForm();
  }
});

increaseControl.addEventListener('click', function () {
  resizeInput.value = increaseSize(resizeInput, pictureUploaded);
});

increaseControl.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 13) {
    resizeInput.value = increaseSize(resizeInput, pictureUploaded);
  }
});

decreaseControl.addEventListener('click', function () {
  resizeInput.value = decreaseSize(resizeInput, pictureUploaded);
});

decreaseControl.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 13) {
    resizeInput.value = decreaseSize(resizeInput, pictureUploaded);
  }
});

filters.forEach(function (filter) {
  filter.addEventListener('input', function () {
    applyEffect(filter);
    setEffectLevel(filter, pictureUploaded);
    pin.addEventListener('mouseup', function () {
      setEffectLevel(filter, pictureUploaded);
    });
  });
});

// Показ изображения в полноэкранном режиме

pictureLinks.forEach(function (link) {
  link.addEventListener('click', function (evt) {
    pictures.forEach(function (picture) {
      if (evt.target.src.includes(picture.url)) {
        renderBigPicture(picture);
      }
    });
  });
});

closeBtn.addEventListener('click', function () {
  hideElem(bigPicture);
});
