'use strict';

// отрисовка миниатюры
(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');

  var createPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

    pictureElement.addEventListener('click', function () {
      window.preview.render(picture);
    });
    return pictureElement;
  };

  window.picture = {
    createPicture: createPicture
  };
})();
