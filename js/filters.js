'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  var filtersBlock = document.querySelector('.img-filters__form');
  var currentFilter = filtersBlock.querySelector('.img-filters__button--active');

  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  var filterPopular = function () {
    window.gallery.clear();
    window.gallery.render(window.data.get());
  };

  var filterDiscussed = function () {
    var discussedPictures = window.data.get().slice().sort(function (object1, object2) {
      if (object1.comments.length < object2.comments.length) {
        return 1;
      } else if (object1.comments.length > object2.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });
    window.gallery.clear();
    window.gallery.render(discussedPictures);
  };

  var filterNew = function () {
    var copy = window.data.get().slice();
    var shuffled = window.utils.shuffle(copy, copy.length);
    var newPictures = shuffled.slice(0, 10);
    window.gallery.clear();
    window.gallery.render(newPictures);
  };

  var filtersMap = {
    'popular': filterPopular,
    'new': filterNew,
    'discussed': filterDiscussed
  };

  var filtersBlockClickHandler = function (evt) {
    evt.preventDefault();
    var filterName = evt.target.id.slice(evt.target.id.indexOf('-') + 1);
    if (event.target.tagName.toLowerCase() === 'button') {
      currentFilter.classList.remove('img-filters__button--active');
      currentFilter = event.target;
      currentFilter.classList.add('img-filters__button--active');
      debounce(function () {
        filtersMap[filterName]();
      });
    }
  };

  var showFilters = function () {
    filtersBlock.parentElement.classList.remove('img-filters--inactive');
    filtersBlock.addEventListener('click', filtersBlockClickHandler);
  };

  window.filters = {
    show: showFilters
  };

})();
