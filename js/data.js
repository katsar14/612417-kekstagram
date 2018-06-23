'use strict';

(function () {
  var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
  var PHOTO_COUNT = 25;

  var shuffle = function (arr, startIndex) {
    for (var i = 0; i < startIndex; i++) {
      var currentIndex = window.utils.getRandomInteger(0, i);
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
      likes: window.utils.getRandomInteger(15, 200),
      comments: getRandomArr(comments),
      description: descriptions[window.utils.getRandomInteger(0, descriptions.length - 1)]
    };
  };

  var generatePhotoList = function () {
    var pictures = [];
    for (var i = 1; i <= PHOTO_COUNT; i++) {
      pictures.push(generatePhotoObj(i, COMMENTS, DESCRIPTIONS));
    }
    return pictures;
  };

  window.pictures = generatePhotoList();
})();
