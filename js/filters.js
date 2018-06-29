'use strict';

(function () {
  var filtersBlock = document.querySelector('.img-filters');
  var popularBtn = filtersBlock.querySelector('#filter-popular');
  var newBtn = filtersBlock.querySelector('#filter-new');
  var discussedBtn = filtersBlock.querySelector('#filter-discussed');

  var filterPopular = function (data, container) {
    window.gallery.clear();
    window.gallery.render(data, container)
    console.log(data, container)
  }

  var showFilters = function (data, container) {
    filtersBlock.classList.remove('img-filters--inactive');
    popularBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      filterPopular(data, container)
    })
  };

  window.filters = {
    show: showFilters
  };

})();
