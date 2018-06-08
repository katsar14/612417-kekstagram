'use strict';

var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var commentTemplate = document.querySelector('#picture').content.querySelector('.social__comment');
var picturesContainer = document.querySelector('.pictures');
var bigPictureElement = document.querySelector('.big-picture');
var commentsList = bigPictureElement.querySelector('.social__comments');

var getRandomItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomNum = function (num1, num2) {
  return Math.round(Math.random() * (num2 - num1)) + num1;
};

var getUrlNumbers = function () {
  var urlNumbers = [];
  while (urlNumbers.length < 25) {
    var number = getRandomNum(1, 25);
    if (!urlNumbers.includes(number)) {
      urlNumbers.push(number);
    }
  }
  return urlNumbers;
};

var getComments = function (commentsArray) {
  var comments = [];
  while (comments.length < commentsArray.length) {
    var comment = getRandomItem(commentsArray);
    if (!comments.includes(comment)) {
      comments.push(comment);
    }
  }
  return comments;
};

var generatePhotoObj = function (num, comments, description) {
  return {
    url: 'photos/' + num + '.jpg',
    likes: getRandomNum(15, 200),
    comments: getComments(comments),
    description: getRandomItem(description)
  };
};

var generatePhotoList = function () {
  var pictures = [];
  var urlNumbers = getUrlNumbers();
  for (var i = 0; i < 25; i++) {
    pictures.push(generatePhotoObj(urlNumbers[i], COMMENTS, DESCRIPTIONS));
  }
  return pictures;
};

var pictures = generatePhotoList();

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;
  return pictureElement;
};

var renderPictures = function (pics) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pics.length; i++) {
    fragment.appendChild(renderPicture(pics[i]));
  }
  picturesContainer.appendChild(fragment);
};

renderPictures(pictures);

var renderComment = function (commentText) {
  var commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('.social__picture').src = 'img/avatar-' + getRandomNum(1, 6) + '.svg';
  commentElement.appendChild(document.createTextNode(commentText));
  return commentElement;
};

var createCommentList = function (comments) {
  commentsList.innerHTML = '';
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < comments.length; i++) {
    fragment.appendChild(renderComment(comments[i]));
  }
  commentsList.appendChild(fragment);
};

var renderBigPicture = function (picture) {
  bigPictureElement.classList.remove('hidden');
  bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
  bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
  bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
  createCommentList(picture.comments);
  bigPictureElement.querySelector('.social__caption').textContent = picture.description;
};

renderBigPicture(pictures[0]);

var hideCounters = function () {
  bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPictureElement.querySelector('.social__loadmore').classList.add('visually-hidden');
};

hideCounters();
