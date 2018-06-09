'use strict';

var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var PHOTO_COUNT = 25;

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var commentTemplate = document.querySelector('#picture').content.querySelector('.social__comment');
var picturesContainer = document.querySelector('.pictures');
var bigPictureElement = document.querySelector('.big-picture');
var commentsList = bigPictureElement.querySelector('.social__comments');

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
  bigPictureElement.classList.remove('hidden');
  bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
  bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
  bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
  renderCommentsList(picture.comments);
  bigPictureElement.querySelector('.social__caption').textContent = picture.description;
};

var hideCounters = function () {
  bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPictureElement.querySelector('.social__loadmore').classList.add('visually-hidden');
};

renderPictures(pictures);
renderBigPicture(pictures[0]);
hideCounters();
