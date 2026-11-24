/* ==========================================================================
   lemagnifique.studio — Minimal Interaction & Screening Room Controller
   ========================================================================== */

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 1. Sticky Editorial Hairline Header */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 2. Hero Ambient Showreel Video + Frame-Locked Code HUD */
  const heroVideo = document.getElementById('hero-video');
  const reelToggle = document.getElementById('reel-toggle');
  const reelLabel = document.getElementById('reel-toggle-label');
  const reelTimecode = document.getElementById('reel-timecode');
  const reelChapter = document.getElementById('reel-chapter');
  const reelFill = document.getElementById('reel-progress-fill');
  const reelPips = document.querySelectorAll('.reel-pip[data-seek]');

  const CHAPTERS = [
    { start: 0.0, label: '01 / 05 · THE COLOSSEUM · AD 70–2026' },
    { start: 2.2, label: '02 / 05 · PYRAMIDS OF GIZA · 2600 BCE–2026' },
    { start: 4.4, label: '03 / 05 · NOTRE-DAME · 1163–2024' },
    { start: 6.6, label: '04 / 05 · GREAT WALL · 770 BCE–2026' },
    { start: 8.8, label: '05 / 05 · STATUE OF LIBERTY · 1865–2026' }
  ];

  const updateReelHUD = () => {
    if (!heroVideo) return;
    const t = heroVideo.currentTime || 0;
    const dur = heroVideo.duration || 11;
    const sec = Math.floor(t);
    const frames = Math.floor((t - sec) * 24);
    if (reelTimecode) {
      reelTimecode.textContent = `00:00:${String(sec).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
    }
    if (reelFill) {
      reelFill.style.width = `${Math.min(100, (t / dur) * 100)}%`;
    }
    let idx = 0;
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (t >= CHAPTERS[i].start - 0.05) { idx = i; break; }
    }
    if (reelChapter) reelChapter.textContent = CHAPTERS[idx].label;
    reelPips.forEach((pip, i) => pip.classList.toggle('is-active', i === idx));
  };

  if (heroVideo) {
    heroVideo.addEventListener('timeupdate', updateReelHUD);
    heroVideo.addEventListener('loadedmetadata', updateReelHUD);
  }

  reelPips.forEach((pip) => {
    pip.addEventListener('click', () => {
      if (!heroVideo) return;
      heroVideo.currentTime = parseFloat(pip.dataset.seek) || 0;
      updateReelHUD();
    });
  });

  const setReelState = (paused) => {
    if (!heroVideo || !reelToggle || !reelLabel) return;
    if (paused) {
      heroVideo.pause();
      reelToggle.setAttribute('aria-pressed', 'true');
      reelLabel.textContent = 'Play Reel';
    } else {
      heroVideo.play().catch(() => {});
      reelToggle.setAttribute('aria-pressed', 'false');
      reelLabel.textContent = 'Pause Reel';
    }
  };

  if (heroVideo && prefersReducedMotion) {
    setReelState(true);
  }

  if (reelToggle) {
    reelToggle.addEventListener('click', () => {
      setReelState(!heroVideo.paused);
    });
  }

  /* 2b. Blender .blend Download Feedback */
  const dlStatus = document.getElementById('dl-status');
  document.querySelectorAll('.dl-btn[data-dl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const file = btn.dataset.dl;
      if (dlStatus) {
        dlStatus.textContent = `Downloading ${file}…`;
      }
    });
  });

  /* 3. Mobile Navigation Drawer (Focus + Escape + Body Scroll Lock) */
  const menuBtn = document.getElementById('menu-btn');
  const drawer = document.getElementById('menu-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  const setDrawer = (open) => {
    if (!drawer || !menuBtn) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && drawerClose) {
      drawerClose.focus();
    } else if (!open) {
      menuBtn.focus();
    }
  };

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => setDrawer(true));
    if (drawerClose) drawerClose.addEventListener('click', () => setDrawer(false));
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => setDrawer(false));
    });
  }

  /* 4. Film Archive Hover Preview & Screening Room Modal */
  const FILMS = {
    colosseum: {
      title: 'The Colosseum',
      span: 'AD 70 — 2026 · 03:50',
      location: 'Rome, Italy',
      preview: 'assets/media/colosseum-preview.mp4',
      poster: 'assets/media/colosseum-poster.jpg',
      youtubeUrl: 'https://youtu.be/4CSVo5w839o',
      summary: 'Built at true meter scale (189 m × 156 m) in Blender 5.2 across 16 chronological stages: 80 travertine arches, the subterranean Hypogeum, the 240-mast Velarium awning, the 847 and 1349 earthquakes, and the 19th-century Stern and Valadier brick buttresses.'
    },
    giza: {
      title: 'The Pyramids of Giza',
      span: '2600 BCE — 2026 · 05:52',
      location: 'Giza Plateau, Egypt',
      preview: 'assets/media/giza-preview.mp4',
      poster: 'assets/media/giza-poster.jpg',
      summary: '4,600 years across the Khufu branch of the Nile: shining white Tura limestone casing, the Great Sphinx, the Heit el-Ghurab workers settlement, medieval casing removal, and the rise of modern Cairo around the plateau.'
    },
    'great-wall': {
      title: 'The Great Wall of China',
      span: '770 BCE — 2026 · 03:23',
      location: 'Northern Frontier, China',
      preview: 'assets/media/great-wall-preview.mp4',
      poster: 'assets/media/great-wall-poster.jpg',
      summary: 'Nearly 2,800 years dynasty by dynasty across 18 scenes — from Spring & Autumn border ridges and Qin earthen ramparts to Ming stone watchtowers spanning 21,196 kilometers.'
    },
    liberty: {
      title: 'The Statue of Liberty',
      span: '1865 — 2026 · 07:18',
      location: 'Paris to New York',
      preview: 'assets/media/liberty-preview.mp4',
      poster: 'assets/media/liberty-poster.jpg',
      summary: '28 scenes following Bartholdi’s Paris workshop, 300 hammered copper sheets, Gustave Eiffel’s riveted iron pylon, the Atlantic crossing aboard the Isère, and the slow green patina over New York Harbor.'
    },
    'notre-dame': {
      title: 'Notre-Dame de Paris',
      span: '1163 — 2024 · 02:20',
      location: 'Île de la Cité, Paris',
      preview: 'assets/media/notre-dame-preview.mp4',
      poster: 'assets/media/notre-dame-poster.jpg',
      summary: '861 years of Gothic stone and timber on the Seine — modular Blender chronology from the first choir foundations through Viollet-le-Duc’s spire, the 2019 fire, and the 2024 restoration.'
    }
  };

  const filmCards = document.querySelectorAll('.film-item[data-film]');
  const modal = document.getElementById('screening-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalSpan = document.getElementById('modal-span');
  const modalSummary = document.getElementById('modal-summary');
  const modalVideo = document.getElementById('modal-video');
  const modalYtLink = document.getElementById('modal-yt-link');
  const modalClose = document.getElementById('modal-close');
  let lastTrigger = null;

  filmCards.forEach((card) => {
    const video = card.querySelector('.film-preview');
    if (canHover && !prefersReducedMotion && video) {
      card.addEventListener('pointerenter', () => {
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
        }
        video.currentTime = 0;
        const p = video.play();
        if (p && typeof p.then === 'function') {
          p.then(() => card.classList.add('is-playing')).catch(() => {});
        }
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-playing');
        video.pause();
      });
    }

    card.addEventListener('click', () => {
      const film = FILMS[card.dataset.film];
      if (!film || !modal) return;
      lastTrigger = card;
      modalTitle.textContent = film.title;
      modalSpan.textContent = `${film.location} · ${film.span}`;
      modalSummary.textContent = film.summary;
      modalVideo.poster = film.poster;
      modalVideo.src = film.preview;
      if (modalYtLink) {
        modalYtLink.href = film.youtubeUrl || 'https://www.youtube.com/@studiolemagnifique';
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (!prefersReducedMotion) {
        modalVideo.play().catch(() => {});
      }
      modalClose.focus();
    });
  });

  const closeModal = () => {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (drawer && drawer.classList.contains('is-open')) setDrawer(false);
    }
  });
})();
