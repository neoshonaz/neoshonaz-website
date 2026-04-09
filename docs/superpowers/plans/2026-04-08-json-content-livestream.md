# JSON Content System & Livestream Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Events, Hero, Classes, Ministries, and Watch sections from hardcoded HTML to JSON data files rendered by JS; redesign Watch section with Rumble live embed and YouTube archive.

**Architecture:** Five JSON files in `data/` are fetched in parallel by `main.js` on page load. Each fetch populates a container div already present in `index.html`. The Watch section conditionally renders a Rumble iframe or a Next Service card based on whether `rumbleEmbedId` is set in `livestream.json`.

**Tech Stack:** Vanilla JS (fetch, Promise.all), HTML, CSS — no framework, no build step. Hosted on Netlify. Local dev via `npx serve .` (required for fetch to work; `file://` blocks cross-origin requests).

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `data/sermon.json` | Current series title + subtitle for hero |
| Create | `data/events.json` | Upcoming event cards array |
| Create | `data/classes.json` | Sunday school + midweek class groups |
| Create | `data/ministries.json` | Ministry cards array |
| Create | `data/livestream.json` | Rumble embed ID, next service text, YouTube archive |
| Modify | `js/main.js` | Add fetchJSON helper, Promise.all, all render functions |
| Modify | `index.html` | Replace hardcoded dynamic content with container divs; redesign Watch section |
| Modify | `css/style.css` | Add Next Service card styles |
| Create | `.claude/skills/manage-livestream.md` | Skill for pre/post-stream workflow |
| Modify | `.gitignore` | Add `.superpowers/` |

---

## Task 1: Create data files with current content

**Files:**
- Create: `data/sermon.json`
- Create: `data/events.json`
- Create: `data/classes.json`
- Create: `data/ministries.json`
- Create: `data/livestream.json`

- [ ] **Step 1: Create `data/sermon.json`**

```json
{
  "series": "Romans",
  "subtitle": "Join us as we explore God's Word together."
}
```

- [ ] **Step 2: Create `data/events.json`**

```json
[
  {
    "month": "MAR",
    "day": "31",
    "title": "Hope Kitchen",
    "description": "Come serve and share a meal with our community.",
    "time": "5:30 PM \u2013 7:30 PM",
    "link": ""
  },
  {
    "month": "APR",
    "day": "6",
    "title": "Palm Sunday Service",
    "description": "Join us for a special Palm Sunday worship service as we begin Holy Week.",
    "time": "8:00 AM & 10:30 AM",
    "link": ""
  },
  {
    "month": "APR",
    "day": "13",
    "title": "Easter Sunday",
    "description": "Celebrate the resurrection of Jesus Christ with your church family.",
    "time": "8:00 AM & 10:30 AM",
    "link": ""
  },
  {
    "month": "APR",
    "day": "20",
    "title": "Community Outreach Day",
    "description": "Serving our neighbors together. Meet in the church parking lot.",
    "time": "9:00 AM",
    "link": ""
  }
]
```

- [ ] **Step 3: Create `data/classes.json`**

```json
{
  "sundaySchool": [
    {
      "icon": "\ud83d\udcd6",
      "title": "Classic Christian Literature",
      "description": "Adult Bible study exploring the great works of the Christian faith.",
      "leader": "",
      "time": "Sundays \u00b7 9:30 AM"
    },
    {
      "icon": "\u271d\ufe0f",
      "title": "Faith Foundations",
      "description": "Current Series: <strong>That the World May Know</strong> \u2014 Discovering how God guided His people to the Promised Land to impact the world in ancient times and today.",
      "leader": "Led by Patrick McNeill",
      "time": "Sundays \u00b7 9:30 AM"
    },
    {
      "icon": "\ud83d\udc51",
      "title": "Sho Naz Kingdom Kids",
      "description": "Christ-centered Bible learning for children in a fun and welcoming environment.",
      "leader": "",
      "time": "Sundays \u00b7 9:30 AM"
    }
  ],
  "midweek": [
    {
      "icon": "\ud83d\udcd6",
      "title": "Hosea",
      "description": "A deep dive into the book of Hosea and God\u2019s relentless love for His people.",
      "leader": "Led by Pastor James & Jason Cramer",
      "time": "Wednesdays \u00b7 7:00 PM"
    },
    {
      "icon": "\u271d\ufe0f",
      "title": "Discipleship Training",
      "description": "Current Class: <strong>Mere Christianity</strong> \u2014 Intentional discipleship equipping believers to grow and serve faithfully.",
      "leader": "Led by Patrick McNeill",
      "time": "Wednesdays \u00b7 7:00 PM"
    },
    {
      "icon": "\ud83d\udd25",
      "title": "Testify Youth Ministry",
      "description": "Vibrant, relevant discipleship for middle and high school students. <strong>1 John 1:2-3</strong>",
      "leader": "",
      "time": "Wednesdays \u00b7 7:00 PM"
    },
    {
      "icon": "\ud83d\udc51",
      "title": "Sho Naz Kingdom Kids",
      "description": "Doors open at 6:30 PM. A small meal is provided before class begins.",
      "leader": "",
      "time": "Wednesdays \u00b7 Doors open 6:30 PM"
    }
  ]
}
```

Note: `description` values may contain safe HTML (`<strong>`) — the render function will use `innerHTML` for this field only, with no user-supplied input.

- [ ] **Step 4: Create `data/ministries.json`**

```json
[
  {
    "icon": "\ud83d\udd25",
    "color": "#2a4a7f",
    "title": "Testify Youth",
    "description": "A vibrant ministry for teens that takes faith seriously and meets students where they are.",
    "link": "",
    "linkText": ""
  },
  {
    "icon": "\u271d\ufe0f",
    "color": "#8B5E3C",
    "title": "Faith Foundations",
    "description": "Building a solid biblical foundation through intentional discipleship at every stage of life.",
    "link": "",
    "linkText": ""
  },
  {
    "icon": "\ud83d\udc51",
    "color": "#3a7a3a",
    "title": "Kingdom Kids",
    "description": "Nurturing the faith of children in a safe, fun, and Christ-centered environment.",
    "link": "",
    "linkText": ""
  },
  {
    "icon": "\ud83c\udf0d",
    "color": "#5a3a8a",
    "title": "Global Nazarene",
    "description": "Connected to the worldwide Church of the Nazarene - a global family serving in over 160 world areas.",
    "link": "",
    "linkText": ""
  },
  {
    "icon": "\ud83c\udfdb\ufe0f",
    "color": "#1e3a5f",
    "title": "Joplin District Church of the Nazarene",
    "description": "We are part of the Joplin District \u2014 a network of Nazarene churches serving southwest Missouri and beyond.",
    "link": "https://www.joplindistrictnaz.org/",
    "linkText": "joplindistrictnaz.org"
  },
  {
    "icon": "\ud83c\udfb5",
    "color": "#7a5a2a",
    "title": "Worship Ministry",
    "description": "Glorifying God through music and creative arts. Opportunities for singers and musicians of all levels.",
    "link": "",
    "linkText": ""
  },
  {
    "icon": "\u2b50",
    "color": "#1a5a5a",
    "title": "PrimeTime Ministries",
    "description": "Enriching the lives of senior adults through fellowship, service, and continued spiritual growth.",
    "link": "",
    "linkText": ""
  }
]
```

- [ ] **Step 5: Create `data/livestream.json`**

```json
{
  "rumbleEmbedId": null,
  "nextService": "Join us this Sunday at 10:30 AM",
  "youtubeChannelUrl": "https://www.youtube.com/@NeoshoNaz",
  "archive": []
}
```

Archive starts empty — the manage-livestream skill will populate it after the first stream.

- [ ] **Step 6: Commit**

```bash
git add data/
git commit -m "feat: add JSON data files for all dynamic content sections"
```

---

## Task 2: Add `.gitignore` entry

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Check if `.gitignore` exists**

```bash
cat .gitignore
```

If it doesn't exist, create it. If it does, open it.

- [ ] **Step 2: Add `.superpowers/` to `.gitignore`**

Add this line to `.gitignore`:

```
.superpowers/
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm directory"
```

---

## Task 3: Add fetch infrastructure to `main.js`

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Append fetch infrastructure to `js/main.js`**

Add the following at the bottom of `js/main.js` (after the existing footer year line):

```js
// ── Content Loader ───────────────────────────────────────
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
```

- [ ] **Step 2: Start local dev server and verify no errors**

```bash
npx serve .
```

Open `http://localhost:3000` in browser. Open DevTools → Console. Expected: no errors, five successful 200 responses for `/data/*.json` in the Network tab. Sections will be empty until render functions are added in later tasks.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: add parallel JSON fetch infrastructure to main.js"
```

---

## Task 4: Render sermon series in hero

**Files:**
- Modify: `js/main.js`
- Modify: `index.html`

- [ ] **Step 1: Verify existing hero element IDs**

In `index.html`, the hero section currently has:
```html
<h1 class="hero-title">Romans</h1>
<p class="hero-subtitle">Join us as we explore God's Word together.</p>
```

These don't have IDs yet. Add IDs to both elements:

```html
<h1 class="hero-title" id="hero-series-title">Romans</h1>
<p class="hero-subtitle" id="hero-series-subtitle">Join us as we explore God's Word together.</p>
```

- [ ] **Step 2: Add `renderSermon()` to `js/main.js`**

Add this function before the `Promise.all(...)` block:

```js
function renderSermon(data) {
  document.getElementById('hero-series-title').textContent = data.series;
  document.getElementById('hero-series-subtitle').textContent = data.subtitle;
}
```

- [ ] **Step 3: Verify in browser**

With `npx serve .` running, open `http://localhost:3000`. The hero should still show "Romans" and the subtitle. Change `data/sermon.json` `"series"` to `"Test Series"`, refresh — hero title should update. Revert the change.

- [ ] **Step 4: Commit**

```bash
git add js/main.js index.html
git commit -m "feat: render sermon series hero from sermon.json"
```

---

## Task 5: Render events from JSON

**Files:**
- Modify: `index.html`
- Modify: `js/main.js`

- [ ] **Step 1: Replace event cards in `index.html` with a container**

Find the events section in `index.html`. Replace everything between `<div class="cards-grid">` and its closing `</div>` (the four `<article class="card event-card">` blocks) with a single container div. The result should be:

```html
<section class="section" id="events">
  <div class="container">
    <div class="section-header">
      <h2>Upcoming Events</h2>
      <p>Stay connected with what's happening at Neosho Nazarene.</p>
    </div>
    <div class="cards-grid" id="events-container"></div>
  </div>
</section>
```

- [ ] **Step 2: Add `renderEvents()` to `js/main.js`**

Add this function before the `Promise.all(...)` block:

```js
function renderEvents(events) {
  const container = document.getElementById('events-container');
  container.innerHTML = events.map(e => `
    <article class="card event-card">
      <div class="event-date">
        <span class="event-month">${e.month}</span>
        <span class="event-day">${e.day}</span>
      </div>
      <div class="event-body">
        <h3>${e.title}</h3>
        <p>${e.description}</p>
        <span class="event-time">${e.time}</span>
        ${e.link ? `<a href="${e.link}" class="btn btn-navy" style="margin-top:0.75rem;display:inline-block" target="_blank">Learn More</a>` : ''}
      </div>
    </article>
  `).join('');
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000`. The Events section should show all four events identical to before. Add a fifth event to `data/events.json`, refresh — it should appear. Remove the test event.

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat: render events section from events.json"
```

---

## Task 6: Render classes from JSON

**Files:**
- Modify: `index.html`
- Modify: `js/main.js`

- [ ] **Step 1: Replace class cards in `index.html` with containers**

Find the Classes section (`id="classes"`). Replace it entirely with:

```html
<section class="section section--gray" id="classes">
  <div class="container">
    <div class="section-header">
      <h2>Classes &amp; Groups</h2>
      <p>Grow in faith and community through our weekly classes.</p>
    </div>
    <h3 class="class-group-title">Sunday School &mdash; Sundays 9:30 AM</h3>
    <div class="cards-grid" id="classes-sunday-container" style="margin-bottom: 3rem;"></div>
    <h3 class="class-group-title">Midweek &mdash; Wednesdays 7:00 PM</h3>
    <div class="cards-grid" id="classes-midweek-container"></div>
  </div>
</section>
```

- [ ] **Step 2: Add `renderClasses()` to `js/main.js`**

Add this function before the `Promise.all(...)` block:

```js
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
```

Note: `c.description` uses `innerHTML` implicitly here via the template literal. The description field may contain `<strong>` tags (e.g. "Current Series: <strong>That the World May Know</strong>"). This is admin-only data in the repo — not user input.

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000`. Classes section should show all 7 classes in their two groups, matching the original. Check that Faith Foundations shows the bold series name and leader line.

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat: render classes section from classes.json"
```

---

## Task 7: Render ministries from JSON

**Files:**
- Modify: `index.html`
- Modify: `js/main.js`

- [ ] **Step 1: Replace ministry cards in `index.html` with a container**

Find the Ministries section (`id="ministries"`). Replace the `<div class="ministries-grid">` and all its children with:

```html
<div class="ministries-grid" id="ministries-container"></div>
```

The full section becomes:

```html
<section class="section" id="ministries">
  <div class="container">
    <div class="section-header">
      <h2>Ministries</h2>
      <p>Opportunities to serve, grow, and connect with your church family and community.</p>
    </div>
    <div class="ministries-grid" id="ministries-container"></div>
  </div>
</section>
```

- [ ] **Step 2: Add `renderMinistries()` to `js/main.js`**

Add this function before the `Promise.all(...)` block:

```js
function renderMinistries(ministries) {
  const container = document.getElementById('ministries-container');
  container.innerHTML = ministries.map(m => `
    <div class="ministry-card">
      <div class="ministry-badge" style="background: ${m.color};">${m.icon}</div>
      <div class="ministry-body">
        <h3>${m.title}</h3>
        <p>${m.description}${m.link ? ` <a href="${m.link}" target="_blank" style="color:var(--gold);font-weight:600;">${m.linkText}</a>` : ''}</p>
      </div>
    </div>
  `).join('');
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000`. Ministries section should show all 7 ministries. The Joplin District card should have the gold link to joplindistrictnaz.org.

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat: render ministries section from ministries.json"
```

---

## Task 8: Redesign Watch section

**Files:**
- Modify: `index.html`
- Modify: `js/main.js`
- Modify: `css/style.css`

- [ ] **Step 1: Replace Watch section HTML in `index.html`**

Find the Watch section (`id="watch"`) and replace it entirely with:

```html
<!-- ── Watch / Sermons ───────────────────────────────────── -->
<section class="section" id="watch">
  <div class="container">
    <div class="section-header">
      <h2>Watch &amp; Listen</h2>
      <p>Catch up on recent sermons or join us live on Sunday mornings.</p>
    </div>

    <div id="watch-featured"></div>

    <h3 class="watch-archive-title">Previous Sermons</h3>
    <div class="watch-archive" id="watch-archive"></div>

    <div style="text-align:center;margin-top:2rem;">
      <a id="watch-youtube-link" href="https://www.youtube.com/@NeoshoNaz" target="_blank" class="btn btn-navy">
        All Sermons on YouTube
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add Next Service card CSS to `css/style.css`**

Append to the end of `css/style.css`:

```css
/* ── Next Service Card ─────────────────────────────────── */
.next-service-card {
  background: var(--navy);
  border-radius: var(--radius);
  padding: 3rem 2rem;
  text-align: center;
  color: #fff;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.next-service-label {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.75rem;
}

.next-service-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
```

- [ ] **Step 3: Add `renderWatch()` to `js/main.js`**

Add this function before the `Promise.all(...)` block:

```js
function renderWatch(data) {
  const featured = document.getElementById('watch-featured');
  const archiveEl = document.getElementById('watch-archive');
  const ytLink = document.getElementById('watch-youtube-link');

  // Update YouTube channel link
  if (data.youtubeChannelUrl) ytLink.href = data.youtubeChannelUrl;

  // Live embed or Next Service card
  if (data.rumbleEmbedId) {
    featured.innerHTML = `
      <div class="watch-embed" style="margin-bottom:2rem;">
        <iframe
          src="https://rumble.com/embed/${data.rumbleEmbedId}/?pub=4"
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
        <p class="next-service-text">${data.nextService}</p>
      </div>
    `;
  }

  // YouTube archive grid
  if (data.archive && data.archive.length > 0) {
    archiveEl.innerHTML = data.archive.map(s => `
      <a href="https://www.youtube.com/watch?v=${s.videoId}" target="_blank" class="sermon-thumb">
        <div class="sermon-img">
          <img src="https://img.youtube.com/vi/${s.videoId}/mqdefault.jpg" alt="${s.title}" />
          <span class="sermon-play">&#9654;</span>
        </div>
        <p class="sermon-name">${s.title}</p>
        <span class="sermon-date">${s.date}</span>
      </a>
    `).join('');
  } else {
    archiveEl.innerHTML = '<p style="color:var(--gray-400);text-align:center;">Sermon archive coming soon.</p>';
  }
}
```

- [ ] **Step 4: Verify offline state in browser**

Open `http://localhost:3000`. The Watch section should show:
- The navy Next Service card with "Join us this Sunday at 10:30 AM" in gold/white
- "Previous Sermons" heading with the "Sermon archive coming soon." placeholder
- "All Sermons on YouTube" button linking to the channel

- [ ] **Step 5: Verify live state**

Temporarily edit `data/livestream.json` — set `"rumbleEmbedId": "test123"`. Refresh the browser. The Watch section should show a Rumble iframe embed instead of the Next Service card. Revert `rumbleEmbedId` back to `null`.

- [ ] **Step 6: Verify archive renders**

Temporarily add a real YouTube video ID to `data/livestream.json`:

```json
"archive": [
  {
    "videoId": "dQw4w9WgXcQ",
    "title": "Test Sermon",
    "date": "April 6, 2025",
    "pastor": "Rev. James Keezer"
  }
]
```

Refresh — a sermon thumbnail card should appear. Remove the test entry and restore `"archive": []`.

- [ ] **Step 7: Commit**

```bash
git add index.html js/main.js css/style.css
git commit -m "feat: redesign Watch section with Rumble embed, Next Service card, and YouTube archive"
```

---

## Task 9: Create manage-livestream skill

**Files:**
- Create: `.claude/skills/manage-livestream.md`

- [ ] **Step 1: Create `.claude/` directory if it doesn't exist**

```bash
mkdir -p .claude/skills
```

- [ ] **Step 2: Create `.claude/skills/manage-livestream.md`**

```markdown
---
name: manage-livestream
description: Use when setting up or tearing down a livestream for the church website. Covers pre-stream (going live) and post-stream (adding to archive) workflows for data/livestream.json.
triggers:
  - "go live"
  - "set up stream"
  - "start stream"
  - "end stream"
  - "post stream"
  - "add sermon to archive"
  - "stream is over"
---

# Manage Livestream

## Before You Start

You need:
- The Rumble video/embed ID for today's stream
- (Post-stream only) The YouTube video ID of the uploaded recording

How to find the Rumble embed ID:
1. Go to Rumble Studio and start/schedule your stream
2. On the video page, click Share → Embed
3. The embed URL looks like: `https://rumble.com/embed/v1a2b3c/?pub=4`
4. The ID is the part after `/embed/` and before `/?pub=4` — e.g. `v1a2b3c`

---

## Pre-Stream Workflow (Going Live)

Run this ~5 minutes before the service starts.

**Step 1:** Open `data/livestream.json`

**Step 2:** Set `rumbleEmbedId` to the Rumble video ID:
```json
{
  "rumbleEmbedId": "v1a2b3c",
  "nextService": "Join us this Sunday at 10:30 AM",
  ...
}
```

**Step 3:** Optionally update `nextService` to reflect the next upcoming service date if you know it (e.g. `"Join us Sunday April 20 at 10:30 AM"`).

**Step 4:** Commit and push:
```bash
git add data/livestream.json
git commit -m "live: set Rumble embed for today's service"
git push
```

Netlify deploys in ~30 seconds. The website will now show the live Rumble embed.

---

## Post-Stream Workflow (After Service Ends)

Run this after the stream ends and the YouTube recording is available.

**Step 1:** Find the YouTube video ID
- Go to YouTube Studio → Content → find today's video
- The video URL is `https://www.youtube.com/watch?v=VIDEOID` — copy the ID

**Step 2:** Open `data/livestream.json`

**Step 3:** Clear `rumbleEmbedId` and add the sermon to the TOP of the `archive` array:
```json
{
  "rumbleEmbedId": null,
  "nextService": "Join us this Sunday at 10:30 AM",
  "youtubeChannelUrl": "https://www.youtube.com/@NeoshoNaz",
  "archive": [
    {
      "videoId": "NEW_YOUTUBE_VIDEO_ID",
      "title": "Sermon Title Here",
      "date": "April 13, 2025",
      "pastor": "Rev. James Keezer"
    },
    ...existing entries...
  ]
}
```

**Step 4:** Commit and push:
```bash
git add data/livestream.json
git commit -m "content: add [Sermon Title] to archive, clear live embed"
git push
```

The website will now show the Next Service card and the new sermon in the archive grid.

---

## YouTube Simulcast Setup (One-Time)

To automatically record to YouTube when you stream on Rumble:

1. YouTube Studio → Go Live → Stream → copy your **Stream Key**
2. Rumble Studio → Settings → Multistream → Add Destination:
   - RTMP URL: `rtmp://a.rtmp.youtube.com/live2`
   - Stream Key: (paste from step 1)
3. Save and test with a private stream

After setup, every Rumble stream automatically records to YouTube — no manual upload needed.
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/manage-livestream.md
git commit -m "feat: add manage-livestream skill for pre/post stream workflow"
```

---

## Task 10: Final verification

- [ ] **Step 1: Run full site check with local server**

```bash
npx serve .
```

Open `http://localhost:3000`. Verify each section:
- Hero shows "Romans" series title from `sermon.json`
- Events shows all 4 upcoming events
- Classes shows 3 Sunday School + 4 Midweek classes in correct groups
- Ministries shows all 7 ministry cards with correct badge colors
- Watch section shows the Next Service card (navy, gold label)
- DevTools Console shows no errors

- [ ] **Step 2: Smoke-test live embed**

Set `"rumbleEmbedId": "test123"` in `data/livestream.json`, refresh. Watch section switches to Rumble iframe. Set back to `null`, refresh — Next Service card returns.

- [ ] **Step 3: Final commit and push**

```bash
git push
```

Verify Netlify deploy completes and production site matches local.
