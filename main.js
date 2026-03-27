/* ============================================
   CARRYING IT ALL — Global JavaScript
   ============================================ */

// ---- NAV SCROLL SHADOW ----
const nav = document.querySelector('.site-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ---- MOBILE MENU ----
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    // animate bars
    const bars = hamburger.querySelectorAll('span');
    if (open) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });
  // close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ---- ACTIVE NAV LINK ----
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ---- SCROLL REVEAL ----
(function() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

// ---- RSS FEED FETCHER ----
// Uses rss2json to avoid CORS issues — no API key needed for public feeds
const RSS_PROXIES = [
  feed => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&api_key=&count=20`,
  feed => `https://api.allorigins.win/get?url=${encodeURIComponent(feed)}`
];

// Podcast RSS URLs — update these when she submits to directories
const PODCAST_RSS = {
  spotify: '',   // leave blank — Spotify RSS not public
  apple:   '',   // her Apple Podcasts RSS feed URL goes here
  // Most podcast hosts (Buzzsprout, Anchor, Podbean etc.) provide a direct RSS URL
  // This is the MAIN RSS to use:
  main:    'https://anchor.fm/s/110a832c8/podcast/rss'
};

/**
 * fetchEpisodes(rssUrl)
 * Fetches and parses a podcast RSS feed.
 * Returns array of episode objects.
 */
async function fetchEpisodes(rssUrl) {
  if (!rssUrl) return null;

  // Try rss2json first (cleanest response)
  try {
    const res = await fetch(RSS_PROXIES[0](rssUrl));
    if (!res.ok) throw new Error('rss2json failed');
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('bad status');
    return data.items.map((item, i) => ({
      num:     data.items.length - i,
      title:   item.title || 'Episode',
      desc:    item.description ? stripHtml(item.description).slice(0, 200) : '',
      date:    item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
      link:    item.link || item.guid || '#',
      thumb:   item.thumbnail || item.enclosure?.thumbnail || '',
      duration: item.itunes_duration ? formatDuration(item.itunes_duration) : '',
      audio:   item.enclosure?.link || ''
    }));
  } catch (_) {}

  // Fallback: allorigins proxy, parse XML manually
  try {
    const res = await fetch(RSS_PROXIES[1](rssUrl));
    if (!res.ok) throw new Error('allorigins failed');
    const json = await res.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(json.contents, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item'));
    return items.map((item, i) => ({
      num:     items.length - i,
      title:   item.querySelector('title')?.textContent || 'Episode',
      desc:    stripHtml(item.querySelector('description')?.textContent || '').slice(0, 200),
      date:    item.querySelector('pubDate')?.textContent
               ? new Date(item.querySelector('pubDate').textContent).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
               : '',
      link:    item.querySelector('link')?.textContent || item.querySelector('guid')?.textContent || '#',
      thumb:   item.querySelector('image')?.getAttribute('href') || '',
      duration: item.querySelector('duration')?.textContent ? formatDuration(item.querySelector('duration').textContent) : '',
      audio:   item.querySelector('enclosure')?.getAttribute('url') || ''
    }));
  } catch (_) {}

  return null; // both failed
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

function formatDuration(raw) {
  if (!raw) return '';
  // raw can be "3661" (seconds) or "1:01:01"
  if (raw.includes(':')) return raw;
  const s = parseInt(raw, 10);
  if (isNaN(s)) return raw;
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${String(s % 60).padStart(2, '0')}` : `${m}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * renderEpisodeCard(ep)
 * Returns an HTML string for one episode card.
 */
function renderEpisodeCard(ep, linkOverride) {
  const href = linkOverride || ep.link || '#';
  const thumb = ep.thumb
    ? `<img src="${ep.thumb}" alt="${ep.title}" loading="lazy">`
    : `<span>🎙</span>`;
  return `
    <article class="episode-card reveal">
      <div class="episode-thumb">${thumb}</div>
      <div class="episode-info">
        <div class="episode-num">Episode ${ep.num}${ep.duration ? ' · ' + ep.duration : ''}</div>
        <h3 class="episode-title">${ep.title}</h3>
        <p class="episode-desc">${ep.desc}</p>
        <div class="episode-meta">
          <span class="episode-date">📅 ${ep.date}</span>
        </div>
      </div>
      <a href="${href}" target="_blank" rel="noopener" class="episode-play" aria-label="Listen to ${ep.title}">▶</a>
    </article>`;
}

/**
 * loadEpisodes(containerId, limit)
 * Fetches RSS and renders cards into the given container.
 * Shows placeholder cards if no RSS yet.
 */
async function loadEpisodes(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const rssUrl = PODCAST_RSS.main || PODCAST_RSS.apple;

  if (!rssUrl) {
    // No RSS configured yet — show placeholder cards
    container.innerHTML = getPlaceholderEpisodes(limit || 6).map(renderEpisodeCard).join('');
    initReveal();
    return;
  }

  container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading episodes…</p></div>`;

  const episodes = await fetchEpisodes(rssUrl);

  if (!episodes || episodes.length === 0) {
    container.innerHTML = `<div class="error-state"><p>Episodes coming soon. <a href="#listen" style="color:var(--plum)">Find us on your favourite platform →</a></p></div>`;
    return;
  }

  const shown = limit ? episodes.slice(0, limit) : episodes;
  container.innerHTML = shown.map(ep => renderEpisodeCard(ep)).join('');
  initReveal();
}

function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => io.observe(el));
}

// Placeholder episodes for pre-launch
function getPlaceholderEpisodes(n) {
  const titles = [
    'Welcome to Carrying It All — Our Story',
    'First Trimester Feelings Nobody Talks About',
    'When Pregnancy Doesn\'t Look Like the Movies',
    'Navigating Relationships While Growing a Human',
    'Natural Birth: What I Wish I\'d Known',
    'The Mental Load of Motherhood Is Real',
    'Finding Your Village in the Modern Age',
    'Postpartum Honesty: The Season Nobody Prepares You For',
  ];
  return Array.from({ length: n || 6 }, (_, i) => ({
    num:   i + 1,
    title: titles[i % titles.length],
    desc:  'New episode dropping soon. Subscribe so you never miss a conversation.',
    date:  'Coming Soon',
    link:  '#listen',
    thumb: '',
    duration: ''
  }));
}

// Expose for use in individual pages
window.CarryingItAll = { loadEpisodes, fetchEpisodes, renderEpisodeCard, getPlaceholderEpisodes, PODCAST_RSS };
