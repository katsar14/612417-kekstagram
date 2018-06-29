'use strict';

(function () {
  var filtersBlock = document.querySelector('.img-filters');

  var filterPopular = function () {
    window.gallery.clear();
    window.gallery.render(window.data.get());
  };

  var filterDiscussed = function () {
    var copy = window.data.get().slice();
    var discussedPictures = copy.sort(function (a, b) {
      if (a.comments.length < b.comments.length) {
        return 1;
      } else if (a.comments.length > b.comments.length) {
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

  var filtersBlockClickHandler = function (evt) {
    evt.preventDefault();
    if (evt.target.id === 'filter-popular') {
      filterPopular();
    }
    if (evt.target.id === 'filter-new') {
      filterNew();
    }
    if (evt.target.id === 'filter-discussed') {
      filterDiscussed();
    }
  };

  var showFilters = function () {
    filtersBlock.classList.remove('img-filters--inactive');
    filtersBlock.addEventListener('click', filtersBlockClickHandler);
  };

  window.filters = {
    show: showFilters
  };

})();
