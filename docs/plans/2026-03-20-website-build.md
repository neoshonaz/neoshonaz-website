# Church Website Build — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a modern, single-page HTML/CSS/JS website for Neosho Church of the Nazarene.

**Architecture:** Single `index.html` with anchor-linked sections, a `css/style.css` for all styles, and `js/main.js` for interactivity. Content is hardcoded in HTML. No build step — open in browser directly.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS. Google Fonts (Inter). Google Maps iframe embed. Hosted on Netlify.

---

## Known Content

- **Address:** 1045 Fairhill Dr, Neosho, MO 64850
- **Email:** neoshonazarene@yahoo.com
- **Facebook:** https://www.facebook.com/NazNeosho
- **Phone:** [NOT ON CURRENT SITE — ask church for number before launch]
- **Service times:** Sun 8:00 AM (Traditional) · Sun 9:30 AM Sunday School · Sun 10:30 AM (Blended) · Wed 7:00 PM
- **Staff:** Rev. James Keezer (Senior Pastor) · Rev. Justin Couch (Associate Pastor) · Beau & Lauren Davis (Youth Pastors) · Jason Brant (Children's Ministries) · Lauren Liggett (Worship Leader) · Rev. DL Huffman (Pastor Emeritus) · Rev. Darrell Cox (PrimeTime Ministries)
- **Give link:** https://neoshonaz.churchcenter.com/giving
- **Nazarene beliefs:** https://nazarene.org/what-we-believe/

---

## Task 1: Project Setup

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/main.js`
- Create: `images/.gitkeep`

**Step 1: Create directory structure**

```bash
mkdir -p css js images
touch js/main.js images/.gitkeep
```

**Step 2: Create `index.html` base**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neosho Church of the Nazarene</title>
  <meta name="description" content="Welcome to Neosho Church of the Nazarene. Join us Sundays at 8:00 AM or 10:30 AM at 1045 Fairhill Dr, Neosho, MO." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <!-- sections go here -->
  <script src="js/main.js"></script>
</body>
</html>
```

**Step 3: Create `css/style.css` with design tokens and reset**

```css
/* ── Design Tokens ──────────────────────────────────────── */
:root {
  --navy:      #1e3a5f;
  --navy-dark: #132742;
  --gold:      #c9a84c;
  --gold-light:#e8c96a;
  --white:     #ffffff;
  --gray-50:   #f8f9fa;
  --gray-100:  #f1f3f5;
  --gray-200:  #e9ecef;
  --gray-400:  #868e96;
  --gray-700:  #495057;
  --gray-900:  #212529;
  --radius:    8px;
  --radius-lg: 16px;
  --shadow:    0 2px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  --transition: 0.2s ease;
  --max-width: 1200px;
  --section-pad: 5rem 1.5rem;
}

/* ── Reset ──────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--gray-900);
  background: var(--white);
  line-height: 1.6;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

/* ── Utilities ──────────────────────────────────────────── */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}
.section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 0.5rem;
}
.section-header p {
  color: var(--gray-700);
  font-size: 1.1rem;
  max-width: 560px;
  margin: 0 auto;
}
.btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
}
.btn-primary {
  background: var(--gold);
  color: var(--navy-dark);
}
.btn-primary:hover { background: var(--gold-light); }
.btn-outline {
  background: transparent;
  border-color: var(--white);
  color: var(--white);
}
.btn-outline:hover { background: var(--white); color: var(--navy); }
.btn-navy {
  background: var(--navy);
  color: var(--white);
}
.btn-navy:hover { background: var(--navy-dark); }
```

**Step 4: Verify**

Open `index.html` in a browser. Page should be blank white with no console errors.

**Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: project setup with design tokens and reset"
```

---

## Task 2: Navigation

**Files:**
- Modify: `index.html` (add `<header>`)
- Modify: `css/style.css` (add nav styles)

**Step 1: Add nav HTML inside `<body>` before the script tag**

```html
<header class="site-header" id="top">
  <nav class="nav container">
    <a href="#top" class="nav-logo">
      <span class="nav-logo-text">Neosho<br><strong>Nazarene</strong></span>
    </a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
      <li><a href="#events">Events</a></li>
      <li><a href="#classes">Classes</a></li>
      <li><a href="#ministries">Ministries</a></li>
      <li><a href="#leadership">Leadership</a></li>
      <li><a href="#watch">Watch</a></li>
      <li><a href="#im-new">I'm New</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="https://neoshonaz.churchcenter.com/giving" target="_blank" class="btn btn-primary nav-give">Give</a></li>
    </ul>
  </nav>
</header>
```

**Step 2: Add nav CSS to `style.css`**

```css
/* ── Navigation ─────────────────────────────────────────── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--navy);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}
.nav-logo { display: flex; align-items: center; gap: 0.75rem; }
.nav-logo-text {
  font-size: 0.95rem;
  color: var(--white);
  line-height: 1.3;
  letter-spacing: 0.02em;
}
.nav-logo-text strong { display: block; font-size: 1.1rem; color: var(--gold); }
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.nav-links a {
  color: rgba(255,255,255,0.85);
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
}
.nav-links a:hover,
.nav-links a.active { color: var(--white); background: rgba(255,255,255,0.1); }
.nav-give { padding: 0.4rem 1rem !important; background: var(--gold) !important; color: var(--navy-dark) !important; }
.nav-give:hover { background: var(--gold-light) !important; }
.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.nav-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--white);
  border-radius: 2px;
  transition: var(--transition);
}

@media (max-width: 900px) {
  .nav-toggle { display: flex; }
  .nav-links {
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    background: var(--navy-dark);
    padding: 1rem 1.5rem;
  }
  .nav-links.open { display: flex; }
  .nav-links a { padding: 0.75rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .nav-give { margin-top: 0.5rem; text-align: center; }
}
```

**Step 3: Verify**

Open in browser. Nav should be dark navy with gold "Give" button and church name. Shrink window below 900px — hamburger should appear. (Menu won't open yet — JS comes in Task 13.)

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: sticky navigation with mobile hamburger"
```

---

## Task 3: Hero Section

**Files:**
- Modify: `index.html` (add `<section id="hero">`)
- Modify: `css/style.css` (add hero styles)

**Step 1: Add hero HTML after `<header>`**

```html
<section class="hero" id="hero">
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <p class="hero-eyebrow">Current Sermon Series</p>
    <h1 class="hero-title">[Sermon Series Title]</h1>
    <p class="hero-subtitle">Join us as we explore God's Word together.</p>
    <div class="hero-times">
      <div class="time-card">
        <span class="time-label">Traditional</span>
        <span class="time-value">8:00 AM</span>
        <span class="time-day">Sundays</span>
      </div>
      <div class="time-divider">+</div>
      <div class="time-card">
        <span class="time-label">Blended</span>
        <span class="time-value">10:30 AM</span>
        <span class="time-day">Sundays</span>
      </div>
      <div class="time-card time-card--secondary">
        <span class="time-label">Sunday School</span>
        <span class="time-value">9:30 AM</span>
        <span class="time-day">Sundays</span>
      </div>
      <div class="time-card time-card--secondary">
        <span class="time-label">Evening Service</span>
        <span class="time-value">7:00 PM</span>
        <span class="time-day">Wednesdays</span>
      </div>
    </div>
    <div class="hero-ctas">
      <a href="#im-new" class="btn btn-primary">I'm New Here</a>
      <a href="#watch" class="btn btn-outline">Watch Live</a>
    </div>
  </div>
</section>
```

**Step 2: Add hero CSS**

```css
/* ── Hero ───────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  background:
    linear-gradient(135deg, var(--navy-dark) 0%, #2a4a7f 50%, #1a3055 100%);
  overflow: hidden;
}
/* Decorative cross pattern */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(201,168,76,0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%);
  pointer-events: none;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 60px,
    rgba(255,255,255,0.01) 60px,
    rgba(255,255,255,0.01) 61px
  );
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 1;
  padding: 6rem 1.5rem;
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
}
.hero-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 1rem;
}
.hero-title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 800;
  color: var(--white);
  line-height: 1.1;
  margin-bottom: 1rem;
  max-width: 700px;
}
.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255,255,255,0.75);
  margin-bottom: 2.5rem;
  max-width: 480px;
}
.hero-times {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
  align-items: center;
}
.time-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-lg);
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 130px;
}
.time-card--secondary {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.08);
}
.time-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gold);
}
.time-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--white);
  line-height: 1;
}
.time-day {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
}
.time-divider {
  font-size: 1.5rem;
  color: var(--gold);
  font-weight: 300;
}
.hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }

@media (max-width: 600px) {
  .hero-times { gap: 0.75rem; }
  .time-card { min-width: 110px; padding: 0.8rem 1rem; }
  .time-value { font-size: 1.2rem; }
  .time-divider { display: none; }
}
```

**Step 3: Verify**

Open in browser. Hero should fill most of the viewport with dark navy gradient, large sermon series title placeholder, four time cards, and two CTA buttons. Check mobile — time cards should wrap cleanly.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: hero section with sermon series and service times"
```

---

## Task 4: Events Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add events HTML after hero**

```html
<section class="section" id="events">
  <div class="container">
    <div class="section-header">
      <h2>Upcoming Events</h2>
      <p>Stay connected with what's happening at Neosho Nazarene.</p>
    </div>
    <div class="cards-grid">

      <article class="card event-card">
        <div class="event-date">
          <span class="event-month">APR</span>
          <span class="event-day">6</span>
        </div>
        <div class="event-body">
          <h3>Palm Sunday Service</h3>
          <p>Join us for a special Palm Sunday worship service as we begin Holy Week.</p>
          <span class="event-time">8:00 AM &amp; 10:30 AM</span>
        </div>
      </article>

      <article class="card event-card">
        <div class="event-date">
          <span class="event-month">APR</span>
          <span class="event-day">13</span>
        </div>
        <div class="event-body">
          <h3>Easter Sunday</h3>
          <p>Celebrate the resurrection of Jesus Christ with your church family.</p>
          <span class="event-time">8:00 AM &amp; 10:30 AM</span>
        </div>
      </article>

      <article class="card event-card">
        <div class="event-date">
          <span class="event-month">APR</span>
          <span class="event-day">20</span>
        </div>
        <div class="event-body">
          <h3>Community Outreach Day</h3>
          <p>Serving our neighbors together. Meet in the church parking lot.</p>
          <span class="event-time">9:00 AM</span>
        </div>
      </article>

    </div>
  </div>
</section>
```

**Step 2: Add events + shared card CSS**

```css
/* ── Sections ───────────────────────────────────────────── */
.section { padding: var(--section-pad); }
.section--gray { background: var(--gray-50); }

/* ── Cards Grid ─────────────────────────────────────────── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* ── Event Cards ────────────────────────────────────────── */
.event-card { display: flex; align-items: flex-start; padding: 1.5rem; gap: 1.25rem; }
.event-date {
  flex-shrink: 0;
  width: 60px;
  background: var(--navy);
  border-radius: var(--radius);
  padding: 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}
.event-month {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gold);
}
.event-day {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--white);
  line-height: 1.1;
}
.event-body h3 { font-size: 1.05rem; font-weight: 700; color: var(--navy); margin-bottom: 0.4rem; }
.event-body p { font-size: 0.9rem; color: var(--gray-700); margin-bottom: 0.5rem; }
.event-time {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Step 3: Verify**

Events section appears with three date-badged cards in a responsive grid.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: events section with date cards"
```

---

## Task 5: Classes Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add classes HTML after events**

```html
<section class="section section--gray" id="classes">
  <div class="container">
    <div class="section-header">
      <h2>Classes &amp; Groups</h2>
      <p>Grow in faith and community through our weekly classes.</p>
    </div>
    <div class="cards-grid">

      <div class="card class-card">
        <div class="class-icon">📖</div>
        <h3>Sunday School</h3>
        <p>Adult Bible study exploring classic Christian literature and scripture.</p>
        <span class="class-time">Sundays · 9:30 AM</span>
      </div>

      <div class="card class-card">
        <div class="class-icon">✝️</div>
        <h3>Faith Foundations</h3>
        <p>A class for those exploring Christianity or deepening their faith basics.</p>
        <span class="class-time">Ask for current schedule</span>
      </div>

      <div class="card class-card">
        <div class="class-icon">🔥</div>
        <h3>Testify Youth</h3>
        <p>Engaging, relevant discipleship for middle and high school students.</p>
        <span class="class-time">Wednesdays · 7:00 PM</span>
      </div>

      <div class="card class-card">
        <div class="class-icon">👦</div>
        <h3>Kingdom Kids</h3>
        <p>Fun, age-appropriate Bible learning for children during services.</p>
        <span class="class-time">Wednesdays · 7:00 PM</span>
      </div>

      <div class="card class-card">
        <div class="class-icon">👴</div>
        <h3>PrimeTime Ministries</h3>
        <p>Fellowship, study, and service opportunities for senior adults.</p>
        <span class="class-time">Ask for current schedule</span>
      </div>

    </div>
  </div>
</section>
```

**Step 2: Add class card CSS**

```css
/* ── Class Cards ────────────────────────────────────────── */
.class-card {
  padding: 2rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.class-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.class-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--navy); }
.class-card p { font-size: 0.9rem; color: var(--gray-700); flex: 1; }
.class-time {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.5rem;
}
```

**Step 3: Verify**

Classes appear as a responsive card grid with emoji icons and times.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: classes section"
```

---

## Task 6: Ministries Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add ministries HTML**

```html
<section class="section" id="ministries">
  <div class="container">
    <div class="section-header">
      <h2>Ministries</h2>
      <p>Opportunities to serve, grow, and connect with your church family and community.</p>
    </div>
    <div class="ministries-grid">

      <div class="ministry-card">
        <div class="ministry-badge" style="background: #2a4a7f;">🔥</div>
        <div class="ministry-body">
          <h3>Testify Youth</h3>
          <p>A vibrant ministry for teens that takes faith seriously and meets students where they are.</p>
        </div>
      </div>

      <div class="ministry-card">
        <div class="ministry-badge" style="background: #8B5E3C;">✝️</div>
        <div class="ministry-body">
          <h3>Faith Foundations</h3>
          <p>Building a solid biblical foundation through intentional discipleship at every stage of life.</p>
        </div>
      </div>

      <div class="ministry-card">
        <div class="ministry-badge" style="background: #3a7a3a;">👑</div>
        <div class="ministry-body">
          <h3>Kingdom Kids</h3>
          <p>Nurturing the faith of children in a safe, fun, and Christ-centered environment.</p>
        </div>
      </div>

      <div class="ministry-card">
        <div class="ministry-badge" style="background: #5a3a8a;">🌍</div>
        <div class="ministry-body">
          <h3>Global Nazarene</h3>
          <p>Connected to the worldwide Church of the Nazarene — a global family serving in over 160 world areas.</p>
        </div>
      </div>

      <div class="ministry-card">
        <div class="ministry-badge" style="background: #7a5a2a;">🎵</div>
        <div class="ministry-body">
          <h3>Worship Ministry</h3>
          <p>Glorifying God through music and creative arts. Opportunities for singers and musicians of all levels.</p>
        </div>
      </div>

      <div class="ministry-card">
        <div class="ministry-badge" style="background: #1a5a5a;">⭐</div>
        <div class="ministry-body">
          <h3>PrimeTime Ministries</h3>
          <p>Enriching the lives of senior adults through fellowship, service, and continued spiritual growth.</p>
        </div>
      </div>

    </div>
  </div>
</section>
```

**Step 2: Add ministry CSS**

```css
/* ── Ministries ─────────────────────────────────────────── */
.ministries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}
.ministry-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  border-left: 4px solid var(--gold);
  transition: transform var(--transition), box-shadow var(--transition);
}
.ministry-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
.ministry-badge {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.ministry-body h3 { font-size: 1.05rem; font-weight: 700; color: var(--navy); margin-bottom: 0.35rem; }
.ministry-body p { font-size: 0.9rem; color: var(--gray-700); }
```

**Step 3: Verify**

Ministries display as a two-column grid of horizontal cards with colored badges.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: ministries section"
```

---

## Task 7: Leadership Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: No placeholder images needed** — real photos are hotlinked directly from the existing site.

Note: Rev. Darrell Cox has no photo on the current site; a placeholder SVG is used for him only.

Create `images/placeholder-avatar.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#e9ecef"/>
  <circle cx="150" cy="110" r="55" fill="#adb5bd"/>
  <ellipse cx="150" cy="260" rx="90" ry="60" fill="#adb5bd"/>
</svg>
```

**Step 2: Add leadership HTML**

```html
<section class="section section--gray" id="leadership">
  <div class="container">
    <div class="section-header">
      <h2>Our Leadership</h2>
      <p>Meet the pastors and staff who serve our congregation.</p>
    </div>
    <div class="leadership-grid">

      <div class="leader-card">
        <div class="leader-photo">
          <img src="https://www.neoshonaz.org/hp_wordpress/wp-content/uploads/2025/01/Keezer-Couple-216x300.jpeg" alt="Rev. James Keezer" />
        </div>
        <div class="leader-info">
          <h3>Rev. James Keezer</h3>
          <p class="leader-title">Senior Pastor</p>
          <a href="mailto:neoshonazarene@yahoo.com" class="leader-contact">neoshonazarene@yahoo.com</a>
        </div>
      </div>

      <div class="leader-card">
        <div class="leader-photo">
          <img src="https://www.neoshonaz.org/hp_wordpress/wp-content/uploads/2025/01/Couch-Couple-1-225x300.jpeg" alt="Rev. Justin Couch" />
        </div>
        <div class="leader-info">
          <h3>Rev. Justin Couch</h3>
          <p class="leader-title">Associate Pastor</p>
          <a href="mailto:neoshonazarene@yahoo.com" class="leader-contact">neoshonazarene@yahoo.com</a>
        </div>
      </div>

      <div class="leader-card">
        <div class="leader-photo">
          <img src="https://www.neoshonaz.org/hp_wordpress/wp-content/uploads/2025/10/Davis-Couple-264x300.jpeg" alt="Beau &amp; Lauren Davis" />
        </div>
        <div class="leader-info">
          <h3>Beau &amp; Lauren Davis</h3>
          <p class="leader-title">Youth Pastors</p>
          <a href="mailto:neoshonazarene@yahoo.com" class="leader-contact">neoshonazarene@yahoo.com</a>
        </div>
      </div>

      <div class="leader-card">
        <div class="leader-photo">
          <img src="https://www.neoshonaz.org/hp_wordpress/wp-content/uploads/2025/10/Brant-Couple-300x225.jpeg" alt="Jason Brant" />
        </div>
        <div class="leader-info">
          <h3>Jason Brant</h3>
          <p class="leader-title">Children's Ministries</p>
          <a href="mailto:neoshonazarene@yahoo.com" class="leader-contact">neoshonazarene@yahoo.com</a>
        </div>
      </div>

      <div class="leader-card">
        <div class="leader-photo">
          <img src="https://www.neoshonaz.org/hp_wordpress/wp-content/uploads/2025/10/Liggett-227x300.jpeg" alt="Lauren Liggett" />
        </div>
        <div class="leader-info">
          <h3>Lauren Liggett</h3>
          <p class="leader-title">Worship Leader</p>
          <a href="mailto:neoshonazarene@yahoo.com" class="leader-contact">neoshonazarene@yahoo.com</a>
        </div>
      </div>

      <div class="leader-card">
        <div class="leader-photo">
          <img src="https://www.neoshonaz.org/hp_wordpress/wp-content/uploads/2023/02/Pastor-Huffman-225x300.jpg" alt="Rev. DL Huffman" />
        </div>
        <div class="leader-info">
          <h3>Rev. DL Huffman</h3>
          <p class="leader-title">Pastor Emeritus</p>
          <a href="mailto:neoshonazarene@yahoo.com" class="leader-contact">neoshonazarene@yahoo.com</a>
        </div>
      </div>

      <div class="leader-card">
        <div class="leader-photo">
          <img src="images/placeholder-avatar.svg" alt="Rev. Darrell Cox" />
        </div>
        <div class="leader-info">
          <h3>Rev. Darrell Cox</h3>
          <p class="leader-title">PrimeTime Ministries</p>
          <a href="mailto:neoshonazarene@yahoo.com" class="leader-contact">neoshonazarene@yahoo.com</a>
        </div>
      </div>

    </div>
    <p class="leadership-note">
      Individual staff email addresses and phone numbers will be added — replace <code>neoshonazarene@yahoo.com</code> placeholders with each person's direct contact.
    </p>
  </div>
</section>
```

**Step 3: Add leadership CSS**

```css
/* ── Leadership ─────────────────────────────────────────── */
.leadership-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.leader-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  text-align: center;
  transition: transform var(--transition), box-shadow var(--transition);
}
.leader-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.leader-photo {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--gray-100);
}
.leader-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}
.leader-info { padding: 1.25rem 1rem; }
.leader-info h3 { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 0.25rem; }
.leader-title { font-size: 0.85rem; color: var(--gray-400); margin-bottom: 0.6rem; font-weight: 500; }
.leader-contact {
  font-size: 0.78rem;
  color: var(--gold);
  font-weight: 600;
  word-break: break-all;
  transition: var(--transition);
}
.leader-contact:hover { color: var(--navy); }
.leadership-note {
  text-align: center;
  font-size: 0.85rem;
  color: var(--gray-400);
  font-style: italic;
  margin-top: 1rem;
}
```

**Step 4: Verify**

Six uniform square photo cards in a responsive grid. Photos are placeholder SVGs — real photos slot in by replacing the `src` attributes.

**Step 5: Commit**

```bash
git add index.html css/style.css images/placeholder-avatar.svg
git commit -m "feat: leadership section with uniform photo grid"
```

---

## Task 8: Watch / Sermons Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add watch HTML**

```html
<section class="section" id="watch">
  <div class="container">
    <div class="section-header">
      <h2>Watch &amp; Listen</h2>
      <p>Catch up on recent sermons or join us live on Sunday mornings.</p>
    </div>

    <div class="watch-featured">
      <div class="watch-embed">
        <!-- Replace VIDEO_ID with the YouTube video ID of the latest sermon -->
        <iframe
          src="https://www.youtube.com/embed/VIDEO_ID"
          title="Latest Sermon"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="watch-featured-info">
        <p class="watch-eyebrow">Latest Sermon</p>
        <h3>[Sermon Title]</h3>
        <p class="watch-pastor">Rev. James Keezer · [Date]</p>
        <p>[Brief description of this week's sermon.]</p>
        <a href="https://www.youtube.com/@NeoshoNazarene" target="_blank" class="btn btn-navy" style="margin-top:1.25rem">
          All Sermons on YouTube
        </a>
      </div>
    </div>

    <h3 class="watch-archive-title">Previous Sermons</h3>
    <div class="watch-archive">

      <a href="#" class="sermon-thumb">
        <div class="sermon-img">
          <img src="https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg" alt="Sermon thumbnail" />
          <span class="sermon-play">▶</span>
        </div>
        <p class="sermon-name">[Sermon Title]</p>
        <span class="sermon-date">[Date]</span>
      </a>

      <a href="#" class="sermon-thumb">
        <div class="sermon-img">
          <img src="https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg" alt="Sermon thumbnail" />
          <span class="sermon-play">▶</span>
        </div>
        <p class="sermon-name">[Sermon Title]</p>
        <span class="sermon-date">[Date]</span>
      </a>

      <a href="#" class="sermon-thumb">
        <div class="sermon-img">
          <img src="https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg" alt="Sermon thumbnail" />
          <span class="sermon-play">▶</span>
        </div>
        <p class="sermon-name">[Sermon Title]</p>
        <span class="sermon-date">[Date]</span>
      </a>

    </div>

    <p class="watch-note">
      ⚠️ Replace all <code>VIDEO_ID</code> placeholders with actual YouTube video IDs. If sermons are on Facebook instead, replace iframes with Facebook embed code.
    </p>
  </div>
</section>
```

**Step 2: Add watch CSS**

```css
/* ── Watch / Sermons ────────────────────────────────────── */
.watch-featured {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: center;
  margin-bottom: 3rem;
}
.watch-embed {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  aspect-ratio: 16/9;
  background: #000;
}
.watch-embed iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.watch-eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--gold);
  margin-bottom: 0.5rem;
}
.watch-featured-info h3 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 0.4rem;
}
.watch-pastor { font-size: 0.9rem; color: var(--gray-400); margin-bottom: 0.75rem; }
.watch-archive-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 1.25rem;
}
.watch-archive {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}
.sermon-thumb { display: block; text-decoration: none; }
.sermon-img {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 16/9;
  background: var(--gray-200);
  margin-bottom: 0.6rem;
}
.sermon-img img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition); }
.sermon-thumb:hover .sermon-img img { opacity: 0.8; }
.sermon-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  opacity: 0;
  transition: var(--transition);
  background: rgba(0,0,0,0.35);
}
.sermon-thumb:hover .sermon-play { opacity: 1; }
.sermon-name { font-size: 0.9rem; font-weight: 600; color: var(--gray-900); margin-bottom: 0.2rem; }
.sermon-date { font-size: 0.78rem; color: var(--gray-400); }
.watch-note {
  font-size: 0.85rem;
  color: var(--gray-400);
  font-style: italic;
  text-align: center;
}

@media (max-width: 768px) {
  .watch-featured { grid-template-columns: 1fr; }
}
```

**Step 3: Verify**

Watch section shows a featured embed slot and a scrollable grid of sermon thumbnails. Embed will show an error until a real VIDEO_ID is added.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: watch/sermons section with embed and archive grid"
```

---

## Task 9: I'm New Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add I'm New HTML**

```html
<section class="section section--gray" id="im-new">
  <div class="container">
    <div class="section-header">
      <h2>I'm New Here</h2>
      <p>We're so glad you're considering visiting. Here's everything you need to know.</p>
    </div>
    <div class="new-grid">

      <div class="new-card">
        <div class="new-icon">📍</div>
        <h3>Where &amp; When</h3>
        <p><strong>1045 Fairhill Dr<br>Neosho, MO 64850</strong></p>
        <ul class="new-times">
          <li>☀️ <strong>8:00 AM</strong> — Traditional Service</li>
          <li>📚 <strong>9:30 AM</strong> — Sunday School</li>
          <li>🎵 <strong>10:30 AM</strong> — Blended Service</li>
          <li>🌙 <strong>Wed 7:00 PM</strong> — Evening Service</li>
        </ul>
        <a href="#contact" class="btn btn-navy" style="margin-top:1.25rem">Get Directions</a>
      </div>

      <div class="new-card">
        <div class="new-icon">👋</div>
        <h3>What to Expect</h3>
        <p>Come as you are. Our congregation is warm and welcoming — you don't have to dress up or know anything specific to walk through our doors.</p>
        <p>Our services typically run about an hour. Greeters will be at the door to welcome you and answer any questions. Children's classes are available during the Wednesday evening service.</p>
      </div>

      <div class="new-card">
        <div class="new-icon">🎶</div>
        <h3>Worship Style</h3>
        <p>We offer two distinct Sunday morning experiences to fit different preferences:</p>
        <ul class="new-times">
          <li><strong>8:00 AM</strong> — Traditional worship with hymns and a formal feel.</li>
          <li><strong>10:30 AM</strong> — Blended worship with a mix of contemporary and traditional elements.</li>
        </ul>
        <p style="margin-top:0.75rem">Both services feature Bible-based preaching from our pastoral team.</p>
      </div>

    </div>
  </div>
</section>
```

**Step 2: Add I'm New CSS**

```css
/* ── I'm New ────────────────────────────────────────────── */
.new-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.new-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.new-icon { font-size: 2.5rem; }
.new-card h3 { font-size: 1.2rem; font-weight: 800; color: var(--navy); }
.new-card p { font-size: 0.95rem; color: var(--gray-700); }
.new-times {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--gray-700);
}
```

**Step 3: Verify**

Three cards side by side (stacking on mobile) with location, what to expect, and worship style.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: im-new section for first-time visitors"
```

---

## Task 10: What We Believe Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add believe HTML**

```html
<section class="section believe-section" id="believe">
  <div class="container">
    <div class="believe-inner">
      <div class="believe-text">
        <p class="hero-eyebrow" style="color:var(--gold);">Our Foundation</p>
        <h2>What We Believe</h2>
        <p>We are part of the global Church of the Nazarene, a denomination rooted in the Wesleyan-Holiness tradition. We believe in the transforming grace of God available to every person — that Jesus Christ saves, sanctifies, and renews.</p>
        <p>Our beliefs are grounded in Scripture and expressed in the Church of the Nazarene's Articles of Faith.</p>
        <div class="believe-ctas">
          <a href="https://nazarene.org/what-we-believe/" target="_blank" class="btn btn-primary">
            What We Believe
          </a>
        </div>
      </div>
      <div class="believe-pillars">
        <div class="pillar">
          <span class="pillar-icon">✝️</span>
          <h4>Salvation</h4>
          <p>We believe in salvation by grace through faith in Jesus Christ.</p>
        </div>
        <div class="pillar">
          <span class="pillar-icon">🕊️</span>
          <h4>Holy Spirit</h4>
          <p>We believe in the sanctifying work of the Holy Spirit in the believer's life.</p>
        </div>
        <div class="pillar">
          <span class="pillar-icon">📖</span>
          <h4>Scripture</h4>
          <p>We believe the Bible is the inspired Word of God and our guide for life and faith.</p>
        </div>
        <div class="pillar">
          <span class="pillar-icon">🌍</span>
          <h4>Community</h4>
          <p>We believe the Church is called to love God and love our neighbors — locally and globally.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Add believe CSS**

```css
/* ── What We Believe ────────────────────────────────────── */
.believe-section {
  background: var(--navy);
  color: var(--white);
}
.believe-section .section-header h2 { color: var(--white); }
.believe-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}
.believe-text h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--white);
  margin-bottom: 1rem;
}
.believe-text p { color: rgba(255,255,255,0.8); margin-bottom: 1rem; font-size: 1rem; }
.believe-ctas { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem; }
.believe-pillars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.pillar {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
}
.pillar-icon { font-size: 1.75rem; display: block; margin-bottom: 0.5rem; }
.pillar h4 { font-size: 0.95rem; font-weight: 700; color: var(--gold); margin-bottom: 0.35rem; }
.pillar p { font-size: 0.85rem; color: rgba(255,255,255,0.7); }

@media (max-width: 768px) {
  .believe-inner { grid-template-columns: 1fr; gap: 2rem; }
}
```

**Step 3: Verify**

Dark navy section with two columns: belief text + CTA buttons on left, four pillar cards on right.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: what we believe section"
```

---

## Task 11: Contact Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add contact HTML**

```html
<section class="section section--gray" id="contact">
  <div class="container">
    <div class="section-header">
      <h2>Contact &amp; Find Us</h2>
      <p>We'd love to hear from you. Stop by, call, or send us an email.</p>
    </div>
    <div class="contact-grid">

      <div class="contact-block">
        <h3>📍 Address</h3>
        <p>1045 Fairhill Dr<br>Neosho, MO 64850</p>
        <h3 style="margin-top:1.5rem">🕐 Service Times</h3>
        <ul class="new-times">
          <li><strong>Sun 8:00 AM</strong> — Traditional</li>
          <li><strong>Sun 9:30 AM</strong> — Sunday School</li>
          <li><strong>Sun 10:30 AM</strong> — Blended</li>
          <li><strong>Wed 7:00 PM</strong> — Evening Service</li>
        </ul>
      </div>

      <div class="contact-block">
        <h3>✉️ Get in Touch</h3>
        <p>
          <a href="mailto:neoshonazarene@yahoo.com" class="contact-link">neoshonazarene@yahoo.com</a>
        </p>
        <!-- Add phone once confirmed: -->
        <!-- <p><a href="tel:+1XXXXXXXXXX" class="contact-link">(XXX) XXX-XXXX</a></p> -->
        <h3 style="margin-top:1.5rem">📱 Follow Us</h3>
        <a href="https://www.facebook.com/NazNeosho" target="_blank" class="contact-link">
          Facebook — @NazNeosho
        </a>
        <div style="margin-top:1.5rem">
          <a href="https://neoshonaz.churchcenter.com/giving" target="_blank" class="btn btn-primary">Give Online</a>
        </div>
      </div>

      <div class="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.0!2d-94.3677!3d36.8692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c8e4b0e0000001%3A0x1!2s1045+Fairhill+Dr%2C+Neosho%2C+MO+64850!5e0!3m2!1sen!2sus!4v1234567890"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Church location map"
        ></iframe>
      </div>

    </div>
  </div>
</section>
```

**NOTE on map embed:** The embed src above uses approximate coordinates. To get the exact embed code: go to Google Maps → search "1045 Fairhill Dr Neosho MO" → click Share → Embed a map → copy the `src` URL from the iframe code. Replace the `src` in the code above.

**Step 2: Add contact CSS**

```css
/* ── Contact ────────────────────────────────────────────── */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 2rem;
  align-items: start;
}
.contact-block {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.75rem;
}
.contact-block h3 { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 0.6rem; }
.contact-block p { font-size: 0.95rem; color: var(--gray-700); }
.contact-link {
  color: var(--gold);
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  display: block;
  margin-bottom: 0.35rem;
}
.contact-link:hover { color: var(--navy); }
.contact-map {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
  aspect-ratio: 4/3;
  background: var(--gray-100);
}
.contact-map iframe { width: 100%; height: 100%; border: none; display: block; }

@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr 1fr; }
  .contact-map { grid-column: 1 / -1; }
}
@media (max-width: 600px) {
  .contact-grid { grid-template-columns: 1fr; }
}
```

**Step 3: Verify**

Contact section shows address, email, and a Google Maps embed. On mobile, map spans full width.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: contact section with map embed"
```

---

## Task 12: Footer

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add footer HTML before `</body>`**

```html
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <p class="footer-name">Neosho Church of the Nazarene</p>
      <p class="footer-address">1045 Fairhill Dr · Neosho, MO 64850</p>
      <p class="footer-address">
        <a href="mailto:neoshonazarene@yahoo.com">neoshonazarene@yahoo.com</a>
      </p>
    </div>
    <div class="footer-links">
      <p class="footer-col-title">Quick Links</p>
      <ul>
        <li><a href="#events">Events</a></li>
        <li><a href="#ministries">Ministries</a></li>
        <li><a href="#leadership">Leadership</a></li>
        <li><a href="#watch">Watch</a></li>
        <li><a href="#im-new">I'm New</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-social">
      <p class="footer-col-title">Connect</p>
      <a href="https://www.facebook.com/NazNeosho" target="_blank" class="footer-social-link">
        📘 Facebook
      </a>
      <a href="https://neoshonaz.churchcenter.com/giving" target="_blank" class="btn btn-primary" style="margin-top:1rem;display:inline-block">
        Give Online
      </a>
    </div>
  </div>
  <div class="footer-bottom container">
    <p>© <span id="year"></span> Neosho Church of the Nazarene · Church of the Nazarene</p>
  </div>
</footer>
```

**Step 2: Add footer CSS**

```css
/* ── Footer ─────────────────────────────────────────────── */
.footer {
  background: var(--navy-dark);
  color: rgba(255,255,255,0.75);
  padding: 3rem 0 0;
}
.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 2.5rem;
}
.footer-name { font-size: 1.1rem; font-weight: 700; color: var(--white); margin-bottom: 0.5rem; }
.footer-address { font-size: 0.9rem; margin-bottom: 0.35rem; }
.footer-address a { color: var(--gold); }
.footer-col-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold); margin-bottom: 0.75rem; }
.footer-links ul { display: flex; flex-direction: column; gap: 0.5rem; }
.footer-links a { font-size: 0.9rem; color: rgba(255,255,255,0.7); transition: var(--transition); }
.footer-links a:hover { color: var(--white); }
.footer-social-link { display: block; font-size: 0.95rem; color: rgba(255,255,255,0.7); transition: var(--transition); }
.footer-social-link:hover { color: var(--white); }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 1.25rem 1.5rem;
  font-size: 0.8rem;
  text-align: center;
  color: rgba(255,255,255,0.45);
}

@media (max-width: 700px) {
  .footer-inner { grid-template-columns: 1fr; gap: 2rem; }
}
```

**Step 3: Verify**

Dark footer with three columns: brand/address, quick links, social/give.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: footer"
```

---

## Task 13: JavaScript — Mobile Nav, Active Scroll Highlight, Year

**Files:**
- Modify: `js/main.js`

**Step 1: Write `js/main.js`**

```javascript
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
```

**Step 2: Verify**

1. Click hamburger on mobile — nav opens/closes
2. Scroll down the page — nav link for the visible section becomes highlighted
3. Footer shows current year

**Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: mobile nav toggle and scroll-based nav highlighting"
```

---

## Task 14: Final Responsive Polish

**Files:**
- Modify: `css/style.css` (add any gaps found in review)

**Step 1: Test at these breakpoints in Chrome DevTools**

- 375px (iPhone SE)
- 768px (iPad)
- 1024px (small laptop)
- 1440px (desktop)

**Step 2: Check each section**

| Section | Check |
|---------|-------|
| Nav | Hamburger works, logo readable |
| Hero | Title doesn't overflow, time cards wrap |
| Events | Cards stack cleanly on mobile |
| Classes | Cards stack cleanly |
| Ministries | Two-column on tablet, one on mobile |
| Leadership | Photos remain square at all sizes |
| Watch | Featured embed stacks on mobile |
| I'm New | Cards stack cleanly |
| Believe | Two columns collapse to one |
| Contact | Map goes full width on mobile |
| Footer | Columns stack on mobile |

**Step 3: Add any missing responsive rules found in review to `style.css`**

**Step 4: Commit**

```bash
git add css/style.css
git commit -m "fix: responsive polish across all breakpoints"
```

---

## Task 15: Netlify Deployment

**Files:**
- Create: `netlify.toml`

**Step 1: Create `netlify.toml`**

```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Step 2: Deploy to Netlify**

Option A (drag-and-drop — easiest):
1. Go to netlify.com → Log in → "Add new site" → "Deploy manually"
2. Drag the entire `nnc/` folder onto the upload zone
3. Netlify gives a random URL like `https://amazing-goldfish-123.netlify.app`
4. Go to Site settings → Change site name → set to `neoshonazarene` or similar

Option B (Git-connected — best for ongoing updates):
1. Push project to a GitHub repo
2. Netlify → "Add new site" → "Import from Git" → connect repo
3. Branch: main, Publish dir: `.` → Deploy
4. Every `git push` auto-deploys the site

**Step 3: Set custom domain (if transferring neoshonaz.org)**

Netlify → Domain settings → Add custom domain → follow DNS instructions to point neoshonaz.org to Netlify.

**Step 4: Final commit**

```bash
git add netlify.toml
git commit -m "feat: netlify config and deployment ready"
```

---

## After Launch Checklist

- [ ] Replace `[Sermon Series Title]` in hero with the current series
- [ ] Replace all `VIDEO_ID` placeholders in Watch section with real YouTube IDs
- [ ] Replace all `neoshonazarene@yahoo.com` in Leadership cards with individual staff emails (when available)
- [ ] Add phone number to Contact section (once confirmed)
- [ ] Replace Rev. Darrell Cox placeholder with a real photo when available (all other photos hotlink from neoshonaz.org)
- [ ] Get exact Google Maps embed src from maps.google.com and update Contact section
- [ ] Replace Give link with real ChurchCenter URL
- [ ] Update events with real upcoming dates
- [ ] Remove `leadership-note` paragraph from leadership section once real photos/emails are in
- [ ] Remove `watch-note` paragraph from watch section once real video IDs are in
