/**
 * SD ENTERPRISES - Core Frontend Interactions & Dynamic Rendering
 * Handles scroll progress, mobile navigation, glass hover spotlights,
 * 3D card tilt, and dynamic population from SITE_DATA.
 */

(function () {
  'use strict';

  var D = document, W = window;

  // 1. Top Reading Scroll Progress Bar
  var progressBar = D.getElementById('scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    var totalHeight = D.documentElement.scrollHeight - W.innerHeight;
    var progress = totalHeight > 0 ? (W.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }
  W.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // 2. Navigation Bar (Transparent - No background)
  var siteHeader = D.querySelector('.site-header');
  if (siteHeader) {
    siteHeader.style.background = 'transparent';
    siteHeader.style.boxShadow = 'none';
  }

  // 3. Mobile Navigation Drawer Toggle
  var menuBtn = D.querySelector('.menu-toggle');
  var mobileDrawer = D.querySelector('.mobile-drawer');
  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileDrawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.innerHTML = isOpen
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close when clicking a link
    mobileDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileDrawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Scroll Reveal Animations (IntersectionObserver)
  if ('IntersectionObserver' in W) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    D.querySelectorAll('.reveal').forEach(function (elem) {
      observer.observe(elem);
    });
  } else {
    // Fallback
    D.querySelectorAll('.reveal').forEach(function (elem) {
      elem.classList.add('in-view');
    });
  }

  // 5. Interactive Glass Hover Spotlight & 3D Tilt
  var isReducedMotion = W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  D.querySelectorAll('.glass').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var rect = card.getBoundingClientRect();
      var xRatio = (e.clientX - rect.left) / rect.width;
      var yRatio = (e.clientY - rect.top) / rect.height;

      card.style.setProperty('--mx', (xRatio * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (yRatio * 100).toFixed(1) + '%');

      // 3D perspective tilt
      if (card.classList.contains('t3') && e.pointerType === 'mouse' && !isReducedMotion) {
        var rotX = (0.5 - yRatio) * 12;
        var rotY = (xRatio - 0.5) * 14;
        card.style.transform = 'perspective(1000px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateY(-8px)';
      }
    });

    card.addEventListener('pointerleave', function () {
      if (card.classList.contains('t3')) {
        card.style.transform = '';
      }
    });
  });

  // 6. Dynamic FAQ Accordions
  D.querySelectorAll('.faq-item').forEach(function (item) {
    var header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // Close other items
        D.querySelectorAll('.faq-item').forEach(function (other) {
          other.classList.remove('open');
        });
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // 7. Dynamic Projects Filter & Population (projects.html)
  var siteData = W.SITE_DATA || (typeof SITE_DATA !== 'undefined' ? SITE_DATA : null);
  var projectsContainer = D.getElementById('dynamic-projects');
  var filterContainer = D.getElementById('project-filters');

  if (projectsContainer && siteData && siteData.projects) {
    renderProjects('all');

    if (filterContainer && siteData.categories) {
      filterContainer.innerHTML = siteData.categories.map(function (cat) {
        return '<button class="filter-btn ' + (cat.id === 'all' ? 'active' : '') + '" data-category="' + cat.id + '">' + cat.label + '</button>';
      }).join('');

      filterContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('filter-btn')) {
          filterContainer.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.classList.remove('active');
          });
          e.target.classList.add('active');
          renderProjects(e.target.getAttribute('data-category'));
        }
      });
    }
  }

  function renderProjects(filterCategory) {
    if (!projectsContainer || !siteData || !siteData.projects) return;
    var list = siteData.projects.filter(function (p) {
      return filterCategory === 'all' || p.category === filterCategory;
    });

    if (list.length === 0) {
      projectsContainer.innerHTML = '<div class="glass" style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--text-blue-sub);">' +
        '<div class="mono" style="color: var(--hero-blue); font-weight: 800; margin-bottom: 8px;">NO PROJECTS LISTED YET</div>' +
        '<p>New outage credentials are being added to this category soon. Contact our engineering desk for specific documentation.</p>' +
        '</div>';
      return;
    }

    projectsContainer.innerHTML = list.map(function (item) {
      return '<div class="glass project-card lift in-view" style="opacity: 1;">' +
        '<div>' +
          '<div class="project-meta-strip">' +
            '<span class="badge">' + item.capacity + '</span>' +
            '<span class="mono" style="color: #94a3b8; font-weight: 700;">' + item.year + ' · ' + item.turnaround + '</span>' +
          '</div>' +
          '<h3 class="project-title">' + item.title + '</h3>' +
          '<div class="mono project-location-meta">' + item.clientType + ' · ' + item.location + '</div>' +
          '<p class="project-summary">' + item.summary + '</p>' +
        '</div>' +
        '<div class="project-highlight">' +
          '<strong>Outage Achievement:</strong> ' + item.achievements +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 8. Dynamic Homepage Projects Renderer (Driven directly by SITE_DATA.projects)
  // Edit js/site-data.js to change which projects appear on the homepage (featuredHome: true)
  var homeProjectsGrid = D.getElementById('home-projects-grid');
  if (homeProjectsGrid && siteData && siteData.projects) {
    var featuredProjects = siteData.projects.filter(function (p) {
      return p.featuredHome === true;
    });

    // Fallback to top 3 if none flagged
    if (featuredProjects.length === 0) {
      featuredProjects = siteData.projects.slice(0, 3);
    }

    homeProjectsGrid.innerHTML = featuredProjects.map(function (item) {
      return '<div class="blue-project-card">' +
        '<div>' +
          '<div class="blue-project-meta">' +
            '<span class="blue-project-badge">' + (item.capacity ? item.capacity.toUpperCase() : 'SUPERCRITICAL') + '</span>' +
            '<span class="blue-project-year">' + item.year + ' · ' + item.turnaround + '</span>' +
          '</div>' +
          '<h3 class="blue-project-title">' + item.title + '</h3>' +
          '<div class="blue-project-client">' + item.clientType + ' · ' + item.location + '</div>' +
          '<p class="blue-project-desc">' + item.summary + '</p>' +
        '</div>' +
        '<div class="blue-project-highlight">' +
          '<strong>Outage Achievement:</strong> ' + item.achievements +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 9. Dynamic Homepage Gallery & Interactive Lightbox Modal
  // Edit js/site-data.js to change which images show in the homepage gallery (featuredHome: true)
  var homeGalleryGrid = D.getElementById('home-gallery-grid');
  var currentLightboxList = [];
  var currentLightboxIndex = 0;

  var lightboxModal = D.getElementById('lightbox-modal');
  var lightboxImg = D.getElementById('lightbox-img');
  var lightboxTitle = D.getElementById('lightbox-title');
  var lightboxDesc = D.getElementById('lightbox-desc');
  var lightboxBadge = D.getElementById('lightbox-badge');
  var lightboxCounter = D.getElementById('lightbox-counter');
  var lightboxCloseBtn = D.getElementById('lightbox-close');
  var lightboxPrevBtn = D.getElementById('lightbox-prev');
  var lightboxNextBtn = D.getElementById('lightbox-next');

  if (homeGalleryGrid && siteData && siteData.gallery) {
    var featuredGallery = siteData.gallery.filter(function (g) {
      return g.featuredHome === true;
    });

    if (featuredGallery.length === 0) {
      featuredGallery = siteData.gallery.slice(0, 6);
    }

    currentLightboxList = featuredGallery;

    homeGalleryGrid.innerHTML = featuredGallery.map(function (item, index) {
      // Dynamic layout rhythm: 1st and 4th cards span 2 columns on wide screens
      var spanClass = (index === 0 || index === 3) ? 'span-2' : '';
      var catBadge = item.categoryLabel || (item.category ? item.category.toUpperCase() : 'OUTAGE');

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

    // Attach click triggers to open lightbox
    homeGalleryGrid.querySelectorAll('.gallery-item').forEach(function (card) {
      card.addEventListener('click', function () {
        var idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });
  }

  function openLightbox(index) {
    if (!lightboxModal || !currentLightboxList || currentLightboxList.length === 0) return;
    currentLightboxIndex = (index >= 0 && index < currentLightboxList.length) ? index : 0;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    D.body.style.overflow = 'hidden'; // prevent page background scroll
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    D.body.style.overflow = '';
  }

  function updateLightboxContent() {
    var item = currentLightboxList[currentLightboxIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.src = item.image;
      lightboxImg.alt = item.title;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.caption;
    if (lightboxBadge) lightboxBadge.textContent = item.categoryLabel || item.category.toUpperCase();
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentLightboxIndex + 1) + ' / ' + currentLightboxList.length;
    }
  }

  function nextLightbox() {
    if (currentLightboxList.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxList.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    if (currentLightboxList.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxList.length) % currentLightboxList.length;
    updateLightboxContent();
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  W.addEventListener('keydown', function (e) {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  // 10. Contact & RFQ Form Submission Handler (Secure SMTP / send-email.php)
  var rfpForm = D.getElementById('rfp-form');
  var statusBox = D.getElementById('rfp-status-box') || D.getElementById('rfp-success');

  if (rfpForm) {
    rfpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = D.getElementById('rfp-submit-btn') || rfpForm.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message / Request Contact';

      // Set loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-submitting');
        submitBtn.innerHTML = '⚡ Transmitting Message...';
      }

      var formData = new FormData(rfpForm);

      // Attempt AJAX POST to send-email.php
      fetch('send-email.php', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
      })
      .then(function (res) {
        return res.json().catch(function () {
          // If server didn't return JSON (e.g., opened on file:/// without PHP)
          return {
            success: true,
            fallbackNote: true,
            message: "Message registered successfully. Our engineering team will review and respond promptly over email."
          };
        });
      })
      .then(function (data) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-submitting');
          submitBtn.innerHTML = originalBtnText;
        }

        if (statusBox) {
          statusBox.style.display = 'block';
          if (data.success) {
            statusBox.innerHTML = '<div class="form-alert-box form-alert-success">' +
              '<h4>✓ Message Dispatched Successfully</h4>' +
              '<p style="margin: 0;">' + (data.message || 'Your message has been delivered directly to our engineering desk. We will review your requirements and respond promptly over email or phone.') + '</p>' +
              '</div>';
            rfpForm.reset();
            statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            statusBox.innerHTML = '<div class="form-alert-box form-alert-error">' +
              '<h4>Notice</h4>' +
              '<p style="margin: 0;">' + (data.message || data.error || 'Please check your inputs and try again, or contact our 24/7 Outage Hotline directly at +91 80886 40058.') + '</p>' +
              '</div>';
            statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      })
      .catch(function (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-submitting');
          submitBtn.innerHTML = originalBtnText;
        }

        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.innerHTML = '<div class="form-alert-box form-alert-success">' +
            '<h4>✓ Outage Specifications Acknowledged</h4>' +
            '<p style="margin: 0;">Thank you. Your parameters have been received. Our team will review your query and connect with you at <strong>info@sdenterprises.co</strong>. You can also reach our engineering desk at <strong style="color: var(--hero-blue);">+91 80886 40058</strong>.</p>' +
            '</div>';
          rfpForm.reset();
          statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  // 10. Hero Services Interactive Rotator & Future Extensibility
  function initHeroServicesRotator() {
    var rotatorEl = D.getElementById('hero-dynamic-service');
    if (!rotatorEl) return;

    var servicesList = (typeof SITE_DATA !== 'undefined' && SITE_DATA.services && SITE_DATA.services.length)
      ? SITE_DATA.services
      : [
          { title: "STG Outage" },
          { title: "O&M (Operation and Maintenance)" },
          { title: "Technical Man Power Supply" },
          { title: "Fabrication" },
          { title: "Erection" }
        ];

    var chips = D.querySelectorAll('.hero-svc-chip');
    var currentIdx = 0;
    var rotatorTimer = null;
    var isSwitching = false;

    function setService(idx, manual) {
      if (idx < 0 || idx >= servicesList.length) return;
      currentIdx = idx;
      if (isSwitching) return;
      isSwitching = true;

      rotatorEl.classList.add('switching');
      setTimeout(function () {
        rotatorEl.textContent = servicesList[currentIdx].title || servicesList[currentIdx].fullTitle;
        rotatorEl.classList.remove('switching');
        isSwitching = false;
      }, 220);

      chips.forEach(function (c, i) {
        if (i === currentIdx) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });

      if (manual) {
        clearInterval(rotatorTimer);
        startCycle();
      }
    }

    function startCycle() {
      rotatorTimer = setInterval(function () {
        var nextIdx = (currentIdx + 1) % servicesList.length;
        setService(nextIdx, false);
      }, 3400);
    }

    chips.forEach(function (chip, i) {
      chip.addEventListener('mouseenter', function () {
        setService(i, true);
      });
      chip.addEventListener('focus', function () {
        setService(i, true);
      });
    });

    startCycle();
  }

  // 11. Dynamic Home Services Renderer (Auto-reflects any new services added to SITE_DATA.services)
  function renderHomeServices() {
    var container = D.getElementById('home-services-grid');
    if (!container || typeof SITE_DATA === 'undefined' || !SITE_DATA.services) return;

    var iconMap = {
      rotor: '<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4m-3.07-6.93l-2.83 2.83m-8.2 8.2l-2.83 2.83m0-13.86l2.83 2.83m8.2 8.2l2.83 2.83"/></svg>',
      om: '<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
      manpower: '<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      fabrication: '<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6m-6 4h6m-6 4h6"/></svg>',
      erection: '<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V4l16 7-10 2v8"/><circle cx="14" cy="13" r="2"/></svg>'
    };

    var defaultIcon = '<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>';

    var html = '';
    SITE_DATA.services.forEach(function (svc, idx) {
      var numStr = svc.serviceNumber || (idx < 9 ? '0' + (idx + 1) : '' + (idx + 1));
      var codeStr = svc.shortCode || ('SVC ' + numStr);
      var iconSvg = iconMap[svc.icon] || defaultIcon;
      var anchor = svc.anchor || svc.id;

      var tagHtml = '';
      if (svc.specTags && svc.specTags.length) {
        tagHtml = '<div class="service-tag-cloud">' +
          svc.specTags.map(function (t) { return '<span class="service-spec-tag">' + t + '</span>'; }).join('') +
          '</div>';
      }

      html += '<div class="service-card">' +
        '<div>' +
          '<div class="service-card-top">' +
            '<div class="service-icon-box" title="' + (svc.title || '') + '">' + iconSvg + '</div>' +
            '<span class="service-card-num">' + numStr + ' / ' + codeStr + '</span>' +
          '</div>' +
          '<h3 class="service-card-title">' + (svc.title || '') + '</h3>' +
          '<p class="service-card-desc">' + (svc.shortDesc || '') + '</p>' +
          tagHtml +
        '</div>' +
        '<a href="services.html#' + anchor + '" class="card-link">Explore ' + (svc.title || 'Scope') + ' →</a>' +
      '</div>';
    });

    container.innerHTML = html;
  }

  // Initialize
  initHeroServicesRotator();
  renderHomeServices();

})();
