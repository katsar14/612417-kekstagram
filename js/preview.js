'use strict';

// модуль для отрисовки увеличенного изображения

(function () {
  var commentTemplate = document.querySelector('#picture').content.querySelector('.social__comment');
  var bigPicture = document.querySelector('.big-picture');
  var commentsList = bigPicture.querySelector('.social__comments');

  var createComment = function (commentText) {
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src = 'img/avatar-' + window.utils.getRandomInteger(1, 6) + '.svg';
    commentElement.appendChild(document.createTextNode(commentText));
    return commentElement;
  };

  var renderCommentsList = function (comments) {
    commentsList.innerHTML = '';
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < 5; i++) {
      fragment.appendChild(createComment(comments[i]));
    }
    // comments.forEach(function (comment) {
    //   fragment.appendChild(createComment(comment));
    // });
    commentsList.appendChild(fragment);
  };

  var hideCounters = function () {
    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
  };

  var bigPictureEcsPressHandler = function (evt) {
    window.utils.isEscEvent(evt, closeBigPicture);
  };

  var openBigPicture = function () {
    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');
    bigPicture.addEventListener('click', function (evt) {
      if (evt.target.id === 'picture-cancel') {
        closeBigPicture();
      }
    });
    document.addEventListener('keydown', bigPictureEcsPressHandler);
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', bigPictureEcsPressHandler);
  };

  window.renderBigPicture = function (picture) {
    bigPicture.querySelector('.big-picture__img img').src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    renderCommentsList(picture.comments);
    bigPicture.querySelector('.social__caption').textContent = picture.description;
    hideCounters();
    openBigPicture();
  };
})();
