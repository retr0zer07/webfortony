/**
 * Herzel Studio — Portfolio Script
 * Vanilla JS: mobile menu, scroll spy, reveal animations,
 * project modal, keyboard accessibility.
 */

(function () {
  'use strict';

  /* ============================================================
     Project data — edit this to update project cards & modals
     ============================================================ */
  const projectData = {
    1: {
      title:       'Natura',
      category:    'Branding',
      year:        '2024',
      client:      'Natura Cosmetics',
      description: 'Desarrollo de identidad visual completa para una marca de cosmética natural. El proyecto abarcó diseño de logotipo, sistema tipográfico, paleta de color y guía de aplicaciones para packaging, entornos digitales y puntos de venta. El objetivo fue transmitir pureza, cercanía y calidad artesanal.',
      tags:        ['Logotipo', 'Sistema de Identidad', 'Packaging', 'Guía de Marca', 'Tipografía'],
    },
    2: {
      title:       'Café Orión',
      category:    'Identidad Visual',
      year:        '2023',
      client:      'Café Orión S.L.',
      description: 'Creación de identidad visual para una cafetería de especialidad con raíces en la cultura del café de origen. El sistema incluye logotipo principal, variantes de uso, paleta cromática y aplicaciones en menús, packaging de grano y comunicación digital con una estética oscura y sofisticada.',
      tags:        ['Logotipo', 'Identidad Visual', 'Menú', 'Digital', 'Packaging'],
    },
    3: {
      title:       'Vol. 1',
      category:    'Editorial',
      year:        '2024',
      client:      'Revista Vol.',
      description: 'Dirección de arte y diseño de maquetación para el primer número de una publicación independiente de cultura visual contemporánea. El diseño busca el contraste entre espacios vacíos generosos y momentos de alta densidad visual, con una tipografía que dialoga entre tradición y modernidad.',
      tags:        ['Maquetación', 'Dirección de Arte', 'Tipografía', 'Impresión', 'Editorial'],
    },
    4: {
      title:       'Suma',
      category:    'Packaging',
      year:        '2023',
      client:      'Suma Natural',
      description: 'Diseño de línea de packaging para una marca de cosmética sostenible. El sistema de envases refleja los valores de la marca: naturalidad, transparencia y minimalismo. Se trabajó con materiales reciclados y tintas vegetales para alinearse con el posicionamiento ecológico de la empresa.',
      tags:        ['Packaging', 'Etiquetado', 'Sostenibilidad', 'Sistema Visual', 'Imprenta'],
    },
    5: {
      title:       'Pulso',
      category:    'Social Media',
      year:        '2024',
      client:      'Pulso Agency',
      description: 'Sistema de contenido visual para redes sociales de una agencia de comunicación digital. Se desarrolló un kit completo de plantillas para Instagram, LinkedIn y stories, con un sistema modular que permite generar contenido variado manteniendo coherencia visual y reconocibilidad de marca.',
      tags:        ['Social Media', 'Instagram', 'Plantillas', 'Branding Digital', 'Figma'],
    },
    6: {
      title:       'Archetype',
      category:    'Branding Corporativo',
      year:        '2023',
      client:      'Archetype Consulting',
      description: 'Rediseño de identidad corporativa para una consultora de estrategia empresarial. El nuevo sistema visual se fundamenta en geometría precisa y un lenguaje formal sobrio que comunica autoridad, rigor intelectual y visión de futuro. Incluye papelería corporativa, presentaciones y entornos digitales.',
      tags:        ['Branding Corporativo', 'Rediseño', 'Papelería', 'Identidad', 'Estrategia Visual'],
    },
  };

  /* ============================================================
     DOM references
     ============================================================ */
  const header      = document.getElementById('header');
  const menuToggle  = document.getElementById('menu-toggle');
  const mobileMenu  = document.getElementById('mobile-menu');
  const navLinks    = document.querySelectorAll('.nav__link');
  const sections    = document.querySelectorAll('main section[id]');
  const revealEls   = document.querySelectorAll('.reveal');
  const projectCards = document.querySelectorAll('.project-card');
  const modal       = document.getElementById('project-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose  = document.getElementById('modal-close');
  const modalImage  = document.getElementById('modal-image');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle  = document.getElementById('modal-title');
  const modalMeta   = document.getElementById('modal-meta');
  const modalDesc   = document.getElementById('modal-description');
  const modalTags   = document.getElementById('modal-tags');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  const galleryBandCards = document.querySelectorAll('.gallery-bands__card');

  /* ============================================================
     Project media rotator
     - Every 3 seconds changes media with random movement direction.
     - Ready for future multiple images per project via data-images.
     ============================================================ */
  function parseProjectMedia(card) {
    const imageBox = card.querySelector('.project-card__image');
    if (!imageBox) return [];

    const media = [];
    const initialVisual = imageBox.querySelector('svg, img');

    if (initialVisual && initialVisual.tagName.toLowerCase() === 'svg') {
      media.push({ type: 'svg', value: initialVisual.outerHTML });
    } else if (initialVisual && initialVisual.tagName.toLowerCase() === 'img') {
      media.push({
        type: 'img',
        value: initialVisual.getAttribute('src') || '',
        alt: initialVisual.getAttribute('alt') || '',
      });
    }

    // Optional future source list:
    // data-images="img/proj1-01.jpg, img/proj1-02.jpg, ..."
    const extraImages = (card.getAttribute('data-images') || '')
      .split(',')
      .map(function (item) { return item.trim(); })
      .filter(Boolean);

    extraImages.forEach(function (src) {
      media.push({ type: 'img', value: src, alt: '' });
    });

    return media;
  }

  function createVisualNode(mediaItem) {
    if (!mediaItem) return null;

    if (mediaItem.type === 'svg') {
      const template = document.createElement('template');
      template.innerHTML = mediaItem.value.trim();
      return template.content.firstElementChild;
    }

    const image = document.createElement('img');
    image.src = mediaItem.value;
    image.alt = mediaItem.alt || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    return image;
  }

  function directionVectors(direction) {
    switch (direction) {
      case 'up':
        return { old: 'translateY(-9%)', incoming: 'translateY(9%)' };
      case 'down':
        return { old: 'translateY(9%)', incoming: 'translateY(-9%)' };
      case 'left':
        return { old: 'translateX(-9%)', incoming: 'translateX(9%)' };
      default:
        return { old: 'translateX(9%)', incoming: 'translateX(-9%)' };
    }
  }

  function initProjectMediaRotator() {
    const directions = ['up', 'down', 'left', 'right'];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    projectCards.forEach(function (card, cardIndex) {
      const imageBox = card.querySelector('.project-card__image');
      if (!imageBox) return;

      const mediaList = parseProjectMedia(card);
      if (mediaList.length === 0) return;

      let currentIndex = 0;

      imageBox.innerHTML = '';
      const firstLayer = document.createElement('div');
      firstLayer.className = 'project-card__media is-current';
      const firstVisual = createVisualNode(mediaList[currentIndex]);
      if (firstVisual) firstLayer.appendChild(firstVisual);
      imageBox.appendChild(firstLayer);

      if (prefersReducedMotion) {
        return;
      }

      function animateNextMedia() {
        const currentLayer = imageBox.querySelector('.project-card__media.is-current');
        if (!currentLayer) return;

        let nextIndex = currentIndex;
        if (mediaList.length > 1) {
          while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * mediaList.length);
          }
        }

        const direction = directions[Math.floor(Math.random() * directions.length)];
        const vectors = directionVectors(direction);

        const nextLayer = document.createElement('div');
        nextLayer.className = 'project-card__media';
        const nextVisual = createVisualNode(mediaList[nextIndex]);
        if (!nextVisual) return;
        nextLayer.appendChild(nextVisual);
        nextLayer.style.opacity = '0';
        nextLayer.style.transform = vectors.incoming;
        imageBox.appendChild(nextLayer);

        const timing = {
          duration: 780,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          fill: 'forwards',
        };

        const oldAnim = currentLayer.animate(
          [
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: vectors.old, opacity: 0 },
          ],
          timing
        );

        nextLayer.animate(
          [
            { transform: vectors.incoming, opacity: 0 },
            { transform: 'translate(0, 0)', opacity: 1 },
          ],
          timing
        );

        oldAnim.onfinish = function () {
          if (currentLayer.parentNode) {
            currentLayer.parentNode.removeChild(currentLayer);
          }
          nextLayer.classList.add('is-current');
          nextLayer.style.opacity = '';
          nextLayer.style.transform = '';
          currentIndex = nextIndex;
        };
      }

      const initialDelay = 600 + (cardIndex * 220);
      setTimeout(function () {
        animateNextMedia();
        setInterval(animateNextMedia, 5500);
      }, initialDelay);
    });
  }

  function initGalleryBandsFill() {
    if (galleryBandCards.length === 0) return;

    const galleryImageSources = [
      'img/pasarela/pasarela-01.webp',
      'img/pasarela/pasarela-02.webp',
      'img/pasarela/pasarela-03.webp',
      'img/pasarela/pasarela-04.webp',
      'img/pasarela/pasarela-05.webp',
      'img/pasarela/pasarela-06.webp',
      'img/pasarela/pasarela-07.webp',
      'img/pasarela/pasarela-08.webp',
      'img/pasarela/pasarela-09.webp',
    ];

    const fixedImageOrders = [
      [3, 8, 1, 6, 4, 9],
      [7, 2, 9, 4, 1],
      [5, 1, 8, 3, 6, 2],
    ];

    document.querySelectorAll('.gallery-bands__lane').forEach(function (lane, laneIndex) {
      const laneCards = lane.querySelectorAll('.gallery-bands__card');
      const order = fixedImageOrders[laneIndex % fixedImageOrders.length];
      const halfLength = Math.floor(laneCards.length / 2);

      laneCards.forEach(function (slot, cardIndex) {
        const imageIndex = order[cardIndex % halfLength] - 1;
        const image = document.createElement('img');
        image.src = galleryImageSources[imageIndex];
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.fetchPriority = 'low';

        slot.innerHTML = '';
        slot.appendChild(image);
      });
    });
  }

  /* ============================================================
     1. Header — scroll effect
     ============================================================ */
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ============================================================
     2. Mobile menu — toggle open / close
     ============================================================ */
  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('menu-open');
    // Move focus to first link
    const firstLink = mobileMenu.querySelector('.mobile-menu__link');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
    menuToggle.focus();
  }

  menuToggle.addEventListener('click', function () {
    if (mobileMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    }
  });

  /* ============================================================
     3. Scroll spy — highlight active nav link
     ============================================================ */
  let currentSection = '';

  function updateScrollSpy() {
    const scrollMid = window.scrollY + window.innerHeight / 3;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollMid >= top && scrollMid < bottom) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'true');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  /* ============================================================
     4. Reveal animations — IntersectionObserver
     ============================================================ */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately if IO not supported
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ============================================================
     5. Project modal — open, close, keyboard, focus trap
     ============================================================ */
  var lastFocusedCard = null;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    // Populate image — clone current visual (SVG or IMG) from the card
    const card = document.querySelector('[data-project-id="' + projectId + '"]');
    if (card) {
      const mediaSource = card.querySelector(
        '.project-card__media.is-current > svg, .project-card__media.is-current > img, .project-card__image svg, .project-card__image img'
      );

      if (mediaSource && mediaSource.tagName.toLowerCase() === 'svg') {
        const svgClone = mediaSource.cloneNode(true);
        svgClone.removeAttribute('aria-hidden');
        svgClone.setAttribute('role', 'img');
        svgClone.setAttribute('aria-label', data.category + ': ' + data.title);
        modalImage.innerHTML = '';
        modalImage.appendChild(svgClone);
      } else if (mediaSource && mediaSource.tagName.toLowerCase() === 'img') {
        const imgClone = mediaSource.cloneNode(true);
        imgClone.alt = data.category + ': ' + data.title;
        imgClone.loading = 'eager';
        imgClone.decoding = 'sync';
        modalImage.innerHTML = '';
        modalImage.appendChild(imgClone);
      }
    }

    // Populate text fields
    modalCategory.textContent   = data.category;
    modalTitle.textContent      = data.title;
    modalDesc.textContent       = data.description;

    // Populate meta
    modalMeta.innerHTML = [
      '<div class="modal__meta-row"><dt>Año</dt><dd>' + data.year + '</dd></div>',
      '<div class="modal__meta-row"><dt>Cliente</dt><dd>' + data.client + '</dd></div>',
      '<div class="modal__meta-row"><dt>Disciplina</dt><dd>' + data.category + '</dd></div>',
    ].join('');

    // Populate tags
    modalTags.innerHTML = data.tags
      .map(function (tag) { return '<li>' + tag + '</li>'; })
      .join('');

    // Show modal
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus close button
    requestAnimationFrame(function () {
      modalClose.focus();
    });
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Return focus to the card that triggered the modal
    if (lastFocusedCard) {
      lastFocusedCard.focus();
      lastFocusedCard = null;
    }
  }

  // Open modal when project card is clicked or Enter/Space pressed
  projectCards.forEach(function (card) {
    card.addEventListener('click', function () {
      lastFocusedCard = card;
      openModal(card.getAttribute('data-project-id'));
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocusedCard = card;
        openModal(card.getAttribute('data-project-id'));
      }
    });
  });

  // Close modal via close button
  modalClose.addEventListener('click', closeModal);

  // Close modal via overlay click
  modalOverlay.addEventListener('click', closeModal);

  // Close modal via ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Focus trap inside modal
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    if (!modal.classList.contains('is-open')) return;

    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const focusableArr = Array.prototype.slice.call(focusable);
    if (focusableArr.length === 0) return;

    const first = focusableArr[0];
    const last  = focusableArr[focusableArr.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ============================================================
     6. Smooth scroll — polyfill for older browsers
         (Most modern browsers support CSS scroll-behavior: smooth,
          but we add JS fallback for anchor links.)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      // Close mobile menu if open
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }

      // Use native scrollIntoView if smooth not supported
      if (!('scrollBehavior' in document.documentElement.style)) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
     7. Stagger reveal for project cards and service items
     ============================================================ */
  function applyStagger(selector, parentSelector) {
    document.querySelectorAll(parentSelector).forEach(function (parent) {
      const children = parent.querySelectorAll(selector);
      children.forEach(function (child, i) {
        child.style.transitionDelay = (i * 0.08) + 's';
      });
    });
  }

  applyStagger('.project-card', '.projects__grid');
  applyStagger('.service-item', '.services__list');
  initProjectMediaRotator();
  initGalleryBandsFill();

})();
