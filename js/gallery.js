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

  var lightboxBadge = D.getElementById('lightbox-badge');
  var lightboxCounter = D.getElementById('lightbox-counter');
  var lightboxPrevBtn = D.getElementById('lightbox-prev');
  var lightboxNextBtn = D.getElementById('lightbox-next');

  var currentItems = [];
  var currentIndex = 0;

  // Category Filters directly from SITE_DATA (Prioritizes dedicated galleryCategories)
  var categories = (siteData && siteData.galleryCategories) ? siteData.galleryCategories : (
    (siteData && siteData.categories) ? siteData.categories : [
      { id: 'all', label: 'All Photos' },
      { id: 'stg', label: 'STG Outages' },
      { id: 'om', label: 'O&M Operations' },
      { id: 'manpower', label: 'Technical Manpower' },
      { id: 'fabrication', label: 'Fabrication' },
      { id: 'erection', label: 'Erection' },
      { id: 'store', label: 'Our Store & Machinery' }
    ]
  );

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

    currentItems = items;

    if (items.length === 0) {
      galleryGrid.innerHTML = '<div class="glass" style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--text-blue-sub);">' +
        '<div class="mono" style="color: var(--hero-blue); font-weight: 800; margin-bottom: 8px;">NO PHOTOS YET</div>' +
        '<p>New site execution photographs are being indexed for this discipline. Check back soon.</p>' +
        '</div>';
      return;
    }

    galleryGrid.innerHTML = items.map(function (item, index) {
      var spanClass = (index === 0 || index === 3) ? 'span-2' : '';
      var catBadge = item.categoryLabel || item.category.toUpperCase();

      return '<div class="gallery-item glass lift ' + spanClass + '" data-index="' + index + '" data-id="' + item.id + '">' +
        '<div class="gallery-img-wrap">' +
          '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" decoding="async" onerror="this.onerror=null; this.src=\'assets/images/turbine-rotor-lift.svg\';">' +
          '<span class="gallery-zoom-badge">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Click to Inspect' +
          '</span>' +
          '<div class="gallery-overlay">' +
            '<span class="badge" style="align-self: flex-start; margin-bottom: 6px;">' + catBadge + '</span>' +
            '<h4 class="gallery-item-title">' + item.title + '</h4>' +
            '<p class="gallery-caption">' + item.caption + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Attach click listeners for Lightbox
    galleryGrid.querySelectorAll('.gallery-item').forEach(function (card) {
      card.addEventListener('click', function () {
        var idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });
  }

  function openLightbox(index) {
    if (!lightbox || !currentItems || currentItems.length === 0) return;
    currentIndex = (index >= 0 && index < currentItems.length) ? index : 0;
    updateLightbox();
    lightbox.classList.add('active');
    D.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    D.body.style.overflow = '';
  }

  function updateLightbox() {
    var item = currentItems[currentIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.src = item.image;
      lightboxImg.alt = item.title;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxBadge) lightboxBadge.textContent = item.categoryLabel || item.category.toUpperCase();
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentItems.length;
    }
  }

  function nextLightbox() {
    if (currentItems.length === 0) return;
    currentIndex = (currentIndex + 1) % currentItems.length;
    updateLightbox();
  }

  function prevLightbox() {
    if (currentItems.length === 0) return;
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    updateLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  W.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  // Initial render
  renderGallery('all');

})();
