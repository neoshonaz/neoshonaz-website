// ── Mobile Navigation Toggle ─────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('#nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ── Active Nav Link on Scroll ────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => observer.observe(s));

// ── Footer Year ──────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Content Loader ───────────────────────────────────────
function safeUrl(url) {
  return (url && (url.startsWith('http://') || url.startsWith('https://'))) ? url : '#';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSermon(data) {
  document.getElementById('hero-series-title').textContent = data.series;
  document.getElementById('hero-series-subtitle').textContent = data.subtitle;
}

function safeColor(str) {
  return /^#[0-9a-fA-F]{3,6}$/.test(str) ? str : '#333333';
}

function renderEvents(events) {
  const sorted = [...events].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  const container = document.getElementById('events-container');
  if (sorted.length === 0) {
    container.innerHTML = '<p style="color:var(--gray-400);text-align:center;grid-column:1/-1;">Stay Tuned!</p>';
  } else {
    container.innerHTML = sorted.map(e => `
      <article class="card event-card">
        <div class="event-date">
          <span class="event-month">${escapeHtml(e.month)}</span>
          <span class="event-day">${escapeHtml(e.day)}</span>
        </div>
        <div class="event-body">
          <h3>${escapeHtml(e.title)}</h3>
          <p>${escapeHtml(e.description)}</p>
          <span class="event-time">${escapeHtml(e.time)}</span>
          ${e.link ? `<a href="${safeUrl(e.link)}" class="btn btn-navy" style="margin-top:0.75rem;display:inline-block" target="_blank">Learn More</a>` : ''}
        </div>
      </article>
    `).join('');
  }
}

function renderClasses(data) {
  function classCard(c) {
    return `
      <div class="card class-card">
        <div class="class-icon">${escapeHtml(c.icon)}</div>
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.description)}</p>
        ${c.leader ? `<p class="class-leader">${escapeHtml(c.leader)}</p>` : ''}
        <span class="class-time">${escapeHtml(c.time)}</span>
      </div>
    `;
  }
  document.getElementById('classes-sunday-container').innerHTML =
    data.sundaySchool.map(classCard).join('');
  document.getElementById('classes-midweek-container').innerHTML =
    data.midweek.map(classCard).join('');
}

function renderMinistries(ministries) {
  const container = document.getElementById('ministries-container');
  container.innerHTML = ministries.map(m => `
    <div class="ministry-card">
      <div class="ministry-badge" style="background: ${safeColor(m.color)};">${escapeHtml(m.icon)}</div>
      <div class="ministry-body">
        <h3>${escapeHtml(m.title)}</h3>
        <p>${escapeHtml(m.description)}${m.link ? ` <a href="${safeUrl(m.link)}" target="_blank" style="color:var(--gold);font-weight:600;">${escapeHtml(m.linkText)}</a>` : ''}</p>
      </div>
    </div>
  `).join('');
}

function renderWatch(data) {
  const featured = document.getElementById('watch-featured');
  const archiveEl = document.getElementById('watch-archive');
  const ytLink = document.getElementById('watch-youtube-link');

  if (!featured || !archiveEl || !ytLink) return;

  // Update YouTube channel link
  if (data.youtubeChannelUrl) ytLink.href = data.youtubeChannelUrl;

  // Live embed or Next Service card
  const safeEmbedId = data.rumbleEmbedId && /^[\w-]+$/.test(data.rumbleEmbedId)
    ? data.rumbleEmbedId : null;
  const safePubId = data.rumblePubId && /^[\w-]+$/.test(data.rumblePubId)
    ? data.rumblePubId : '4';

  if (safeEmbedId) {
    featured.innerHTML = `
      <div class="watch-embed" style="margin-bottom:2rem;">
        <iframe
          src="https://rumble.com/embed/${safeEmbedId}/?pub=${safePubId}"
          title="Live Service"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    `;
  } else {
    featured.innerHTML = `
      <div class="next-service-card">
        <p class="next-service-label">Next Service</p>
        <p class="next-service-text">${escapeHtml(data.nextService)}</p>
      </div>
    `;
  }

  // YouTube archive grid
  if (data.archive && data.archive.length > 0) {
    archiveEl.innerHTML = data.archive.map(s => {
      const vid = escapeHtml(s.videoId);
      const title = escapeHtml(s.title);
      const date = escapeHtml(s.date);
      return `
        <a href="https://www.youtube.com/watch?v=${vid}" target="_blank" class="sermon-thumb">
          <div class="sermon-img">
            <img src="https://img.youtube.com/vi/${vid}/mqdefault.jpg" alt="${title}" />
            <span class="sermon-play">&#9654;</span>
          </div>
          <p class="sermon-name">${title}</p>
          <span class="sermon-date">${date}</span>
        </a>
      `;
    }).join('');
  } else {
    archiveEl.innerHTML = '<p style="color:var(--gray-400);text-align:center;">Sermon archive coming soon.</p>';
  }
}

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

Promise.all([
  fetchJSON('data/sermon.json'),
  fetchJSON('data/events.json'),
  fetchJSON('data/classes.json'),
  fetchJSON('data/ministries.json'),
  fetchJSON('data/livestream.json'),
]).then(([sermon, eventsData, classes, ministriesData, livestream]) => {
  renderSermon(sermon);
  renderEvents(eventsData.events);
  renderClasses(classes);
  renderMinistries(ministriesData.ministries);
  renderWatch(livestream);
}).catch(err => console.warn('Content load error:', err));
