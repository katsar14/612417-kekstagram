'use strict';

// модуль для отрисовки увеличенного изображения

(function () {
  var COMMENTS_NUMBER = 5;
  var shownCommentsNumber = COMMENTS_NUMBER;
  var commentTemplate = document.querySelector('#picture').content.querySelector('.social__comment');
  var bigPicture = document.querySelector('.big-picture');
  var commentsList = bigPicture.querySelector('.social__comments');
  var showMoreBtn = bigPicture.querySelector('.social__loadmore');
  var commentsCounter = bigPicture.querySelector('.comments-shown');

  var createComment = function (commentText) {
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src = 'img/avatar-' + window.utils.getRandomInteger(1, 6) + '.svg';
    commentElement.appendChild(document.createTextNode(commentText));
    return commentElement;
  };

  var renderCommentsList = function (comments) {
    commentsList.innerHTML = '';
    var fragment = document.createDocumentFragment();
    shownCommentsNumber = comments.length < COMMENTS_NUMBER ? comments.length : COMMENTS_NUMBER
    for (var i = 0; i < shownCommentsNumber; i++) {
      fragment.appendChild(createComment(comments[i]));
    }
    commentsCounter.textContent = shownCommentsNumber;
    commentsList.appendChild(fragment);
  };

  var bigPictureEcsPressHandler = function (evt) {
    window.utils.isEscEvent(evt, closeBigPicture);
  };

  var BigPictureClickHandler = function (evt) {
    if (evt.target.id === 'picture-cancel') {
      evt.preventDefault();
      closeBigPicture();
    }
  };

  var openBigPicture = function () {
    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');
    bigPicture.addEventListener('click', BigPictureClickHandler);
    document.addEventListener('keydown', bigPictureEcsPressHandler);
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', bigPictureEcsPressHandler);
    bigPicture.removeEventListener('click', BigPictureClickHandler);
    shownCommentsNumber = 5;
    console.log(shownCommentsNumber)
    showMoreBtn.removeEventListener('click', showMoreBtnClickHandler)


  };

  window.renderBigPicture = function (picture) {
    bigPicture.querySelector('.big-picture__img img').src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    renderCommentsList(picture.comments);
    bigPicture.querySelector('.social__caption').textContent = picture.description;
    openBigPicture();
    showMoreBtn.classList.remove('hidden');
    if (picture.comments.length <= COMMENTS_NUMBER) {
        showMoreBtn.classList.add('hidden');
      }
    showMoreBtn.addEventListener('click', showMoreBtnClickHandler)
    //   evt.preventDefault();
    //   console.log(picture.comments);

    //   showMoreComments(picture.comments);
    // });
  };

  var showMoreComments = function (comments) {
    console.log('shownCommentsNumber: ' + shownCommentsNumber)
    console.log('comments length ' + comments.length)

    var hiddenCommentsNumber = comments.length - shownCommentsNumber;
    console.log('hiddenCommentsNumber: ' + hiddenCommentsNumber)
    var commentsToShow = hiddenCommentsNumber < COMMENTS_NUMBER ? hiddenCommentsNumber : COMMENTS_NUMBER;
    console.log('commentsToShow: ' + commentsToShow)

    for (var i = shownCommentsNumber; i < shownCommentsNumber+commentsToShow; i++) {

      commentsList.appendChild(createComment(comments[i]));
    }
    commentsCounter.textContent = shownCommentsNumber;

    shownCommentsNumber += commentsToShow;
    console.log('shownCommentsNumber2: ' + shownCommentsNumber)

    commentsCounter.textContent = shownCommentsNumber;
    if (shownCommentsNumber === comments.length) {
      showMoreBtn.classList.add('hidden');
    }
  }

  var showMoreBtnClickHandler = function (evt) {
    evt.preventDefault();
    console.log(picture.comments);

      showMoreComments(picture.comments);
  }






})();
