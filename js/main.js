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

  // 7. Dynamic Projects Filter & Population (if container exists)
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
            '<span class="mono" style="color: var(--hero-blue); font-weight: 700;">' + item.year + ' · ' + item.turnaround + '</span>' +
          '</div>' +
          '<h3 class="project-title">' + item.title + '</h3>' +
          '<div class="mono" style="color: var(--text-blue-muted); margin-bottom: 12px;">' + item.clientType + ' · ' + item.location + '</div>' +
          '<p class="project-summary">' + item.summary + '</p>' +
        '</div>' +
        '<div class="project-highlight">' +
          '<strong>Milestone:</strong> ' + item.achievements +
        '</div>' +
      '</div>';
    }).join('');
  }

  // 8. Contact & RFQ Form Submission Handler
  var rfpForm = D.getElementById('rfp-form');
  if (rfpForm) {
    rfpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = D.getElementById('rfp-name').value;
      var plant = D.getElementById('rfp-plant').value;
      var capacity = D.getElementById('rfp-capacity').value;
      var dates = D.getElementById('rfp-dates').value;

      var confirmation = D.getElementById('rfp-success');
      if (confirmation) {
        confirmation.style.display = 'block';
        confirmation.innerHTML = '<div class="glass" style="padding: 24px; border-color: #52C41A; background: rgba(82, 196, 26, 0.1); text-align: center;">' +
          '<div style="font-size: 20px; font-weight: 800; color: #52C41A; margin-bottom: 8px;">✓ Outage Inquiry Received</div>' +
          '<p style="color: #ffffff; margin: 0;">Thank you, ' + name + '. Our Lead Turbine Specialist will contact you within 2-4 hours regarding ' + (plant || 'your plant') + ' (' + (capacity || 'STG Unit') + ') for the upcoming window ' + (dates || 'TBD') + '.</p>' +
          '</div>';
        rfpForm.style.display = 'none';
      }
    });
  }

})();
