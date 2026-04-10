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

function renderEvents(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoWeeksOut = new Date(today);
  twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);

  const upcoming = [];
  const calendarEvents = [];

  events.forEach(e => {
    if (!e.date) { upcoming.push(e); return; }
    const d = new Date(e.date + 'T00:00:00');
    if (d <= twoWeeksOut) {
      upcoming.push(e);
    } else {
      calendarEvents.push(e);
    }
  });

  const container = document.getElementById('events-container');
  if (upcoming.length === 0) {
    container.innerHTML = '<p style="color:var(--gray-400);text-align:center;grid-column:1/-1;">No events in the next two weeks. Check the calendar below for future events.</p>';
  } else {
    container.innerHTML = upcoming.map(e => `
      <article class="card event-card">
        <div class="event-date">
          <span class="event-month">${e.month}</span>
          <span class="event-day">${e.day}</span>
        </div>
        <div class="event-body">
          <h3>${e.title}</h3>
          <p>${e.description}</p>
          <span class="event-time">${e.time}</span>
          ${e.link ? `<a href="${safeUrl(e.link)}" class="btn btn-navy" style="margin-top:0.75rem;display:inline-block" target="_blank">Learn More</a>` : ''}
        </div>
      </article>
    `).join('');
  }

  renderCalendar(calendarEvents);
  document.getElementById('events-calendar-section').style.display = '';
}

function renderCalendar(events) {
  // Group events by year-month
  const byMonth = {};

  // Always include the current month so the calendar is never blank
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  byMonth[currentKey] = [];

  events.forEach(e => {
    const key = e.date.slice(0, 7); // "YYYY-MM"
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(e);
  });

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const html = Object.keys(byMonth).sort().map(key => {
    const [year, month] = key.split('-').map(Number);
    const monthEvents = byMonth[key];
    const eventDays = {};
    monthEvents.forEach(e => {
      const day = parseInt(e.date.slice(8), 10);
      if (!eventDays[day]) eventDays[day] = [];
      eventDays[day].push(e);
    });

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push('<div class="cal-cell cal-empty"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      const evs = eventDays[d] || [];
      const dots = evs.map(e =>
        `<span class="cal-dot" title="${escapeHtml(e.title)}"></span>`
      ).join('');
      const hasEvent = evs.length > 0;
      cells.push(`<div class="cal-cell${hasEvent ? ' cal-has-event' : ''}">${d}${dots}</div>`);
    }

    const eventList = monthEvents.length > 0
      ? monthEvents.map(e => `
          <div class="cal-event-item">
            <span class="cal-event-date">${e.time}</span>
            <span class="cal-event-title">${escapeHtml(e.title)}</span>
            ${e.link ? `<a href="${safeUrl(e.link)}" target="_blank" class="cal-event-link">Details</a>` : ''}
          </div>
        `).join('')
      : '<p style="color:var(--gray-400);font-size:0.85rem;text-align:center;margin:0;">No events scheduled this month.</p>';

    return `
      <div class="cal-month">
        <div class="cal-month-header">${monthNames[month - 1]} ${year}</div>
        <div class="cal-grid">
          ${dayLabels.map(l => `<div class="cal-day-label">${l}</div>`).join('')}
          ${cells.join('')}
        </div>
        <div class="cal-event-list">${eventList}</div>
      </div>
    `;
  }).join('');

  document.getElementById('events-calendar').innerHTML = html;
}

function renderClasses(data) {
  function classCard(c) {
    return `
      <div class="card class-card">
        <div class="class-icon">${c.icon}</div>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        ${c.leader ? `<p class="class-leader">${c.leader}</p>` : ''}
        <span class="class-time">${c.time}</span>
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
      <div class="ministry-badge" style="background: ${m.color};">${m.icon}</div>
      <div class="ministry-body">
        <h3>${m.title}</h3>
        <p>${m.description}${m.link ? ` <a href="${safeUrl(m.link)}" target="_blank" style="color:var(--gold);font-weight:600;">${m.linkText}</a>` : ''}</p>
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
]).then(([sermon, events, classes, ministries, livestream]) => {
  renderSermon(sermon);
  renderEvents(events);
  renderClasses(classes);
  renderMinistries(ministries);
  renderWatch(livestream);
}).catch(err => console.warn('Content load error:', err));
