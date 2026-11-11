/**
 * SD ENTERPRISES - High-Performance Gallery & Lightbox Engine
 * Designed for lightning-fast loading, lazy decoding, category filtering,
 * and seamless future image additions via SITE_DATA.gallery.
 */

(function () {
  'use strict';

  var D = document, W = window;
  var galleryGrid = D.getElementById('dynamic-gallery');
  var filterContainer = D.getElementById('gallery-filters');
  var lightbox = D.getElementById('lightbox-modal');
  var lightboxImg = D.getElementById('lightbox-img');
  var lightboxTitle = D.getElementById('lightbox-title');
  var lightboxCaption = D.getElementById('lightbox-caption');
  var lightboxClose = D.getElementById('lightbox-close');

  var siteData = W.SITE_DATA || (typeof SITE_DATA !== 'undefined' ? SITE_DATA : null);
  if (!galleryGrid || !siteData || !siteData.gallery) return;

  // Category Filters directly from SITE_DATA
  var categories = (siteData && siteData.categories) ? siteData.categories : [
    { id: 'all', label: 'All Disciplines' },
    { id: 'stg', label: 'STG Outage' },
    { id: 'tdbfp', label: 'TDBFP & BFPT' },
    { id: 'erection', label: 'Erection' },
    { id: 'fabrication', label: 'Fabrication' },
    { id: 'valves', label: 'Valves' },
    { id: 'manpower', label: 'Manpower Supply' }
  ];

  if (filterContainer) {
    filterContainer.innerHTML = categories.map(function (c) {
      return '<button class="filter-btn ' + (c.id === 'all' ? 'active' : '') + '" data-cat="' + c.id + '">' + c.label + '</button>';
    }).join('');

    filterContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('filter-btn')) {
        filterContainer.querySelectorAll('.filter-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        e.target.classList.add('active');
        renderGallery(e.target.getAttribute('data-cat'));
      }
    });
  }

  function renderGallery(activeCategory) {
    var items = siteData.gallery.filter(function (item) {
      return activeCategory === 'all' || item.category === activeCategory;
    });

    if (items.length === 0) {
      galleryGrid.innerHTML = '<div class="glass" style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--text-blue-sub);">' +
        '<div class="mono" style="color: var(--hero-blue); font-weight: 800; margin-bottom: 8px;">NO PHOTOS YET</div>' +
        '<p>New site execution photographs are being indexed for this discipline. Check back soon.</p>' +
        '</div>';
      return;
    }

    galleryGrid.innerHTML = items.map(function (item, index) {
      // Dynamic layout spans for visual rhythm (first and 4th items can span 2 cols on wide screens)
      var spanClass = (index === 0 || index === 3) ? 'span-2' : '';

      return '<div class="gallery-item glass lift ' + spanClass + '" data-id="' + item.id + '">' +
        '<div class="gallery-img-wrap">' +
          '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" decoding="async" onerror="this.onerror=null; this.src=\'assets/images/turbine-rotor-lift.svg\';">' +
          '<div class="gallery-overlay">' +
            '<span class="badge" style="align-self: flex-start; margin-bottom: 6px;">' + item.category.toUpperCase() + '</span>' +
            '<h4 style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 0;">' + item.title + '</h4>' +
            '<p class="gallery-caption">' + item.caption + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Attach click listeners for Lightbox
    galleryGrid.querySelectorAll('.gallery-item').forEach(function (card) {
      card.addEventListener('click', function () {
        var id = card.getAttribute('data-id');
        var found = siteData.gallery.find(function (g) { return g.id === id; });
        if (found && lightbox) {
          lightboxImg.src = found.image;
          lightboxTitle.textContent = found.title;
          lightboxCaption.textContent = found.caption;
          lightbox.classList.add('active');
        }
      });
    });
  }

  // Lightbox Close Handlers
  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener('click', function () {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });

    W.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });
  }

  // Initial render
  renderGallery('all');

})();
