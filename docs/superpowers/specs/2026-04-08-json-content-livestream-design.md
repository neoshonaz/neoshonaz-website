# JSON Content System & Livestream Redesign
**Date:** 2026-04-08
**Status:** Approved

## Overview

Move four dynamic website sections (Events, Sermon Series Hero, Classes, Ministries) from hardcoded HTML to JSON data files rendered by JavaScript. Redesign the Watch section to feature a Rumble livestream embed with a Next Service fallback card and a YouTube sermon archive. Deliver a Claude Code skill for the pre/post-stream workflow.

Stack remains plain HTML/CSS/JS, no build step, hosted on Netlify.

---

## 1. JSON Content Architecture

### Files

All data files live in a new `data/` directory at the repo root.

**`data/sermon.json`** — Hero section
```json
{
  "series": "Romans",
  "subtitle": "Join us as we explore God's Word together."
}
```

**`data/events.json`** — Events section (array)
```json
[
  {
    "month": "APR",
    "day": "13",
    "title": "Easter Sunday",
    "description": "Celebrate the resurrection of Jesus Christ with your church family.",
    "time": "8:00 AM & 10:30 AM",
    "link": ""
  }
]
```
`link` is optional — empty string means no link rendered.

**`data/classes.json`** — Classes & Groups section
```json
{
  "sundaySchool": [
    {
      "icon": "📖",
      "title": "Classic Christian Literature",
      "description": "Adult Bible study exploring the great works of the Christian faith.",
      "leader": "",
      "time": "Sundays · 9:30 AM"
    }
  ],
  "midweek": [
    {
      "icon": "📖",
      "title": "Hosea",
      "description": "A deep dive into the book of Hosea and God's relentless love for His people.",
      "leader": "Led by Pastor James & Jason Cramer",
      "time": "Wednesdays · 7:00 PM"
    }
  ]
}
```
`leader` is optional — empty string means no leader line rendered.

**`data/ministries.json`** — Ministries section (array)
```json
[
  {
    "icon": "🔥",
    "color": "#2a4a7f",
    "title": "Testify Youth",
    "description": "A vibrant ministry for teens that takes faith seriously and meets students where they are."
  }
]
```

**`data/livestream.json`** — Watch section
```json
{
  "rumbleEmbedId": null,
  "nextService": "Join us this Sunday at 10:30 AM",
  "youtubeChannelUrl": "https://www.youtube.com/@NeoshoNaz",
  "archive": [
    {
      "videoId": "YOUTUBE_VIDEO_ID",
      "title": "Sermon Title",
      "date": "April 6, 2025",
      "pastor": "Rev. James Keezer"
    }
  ]
}
```

`rumbleEmbedId`: when `null` or empty string, the Next Service card is shown. When set to a Rumble video ID (e.g. `"v1a2b3c"`), the Rumble iframe is shown instead.

### Rendering

`main.js` fetches all five files in parallel using `Promise.all()` on `DOMContentLoaded`. Each fetch renders into a dedicated container element already present in `index.html`. If a fetch fails, the section stays empty and logs a console warning — the rest of the page still loads.

`index.html` retains the full section scaffolding (headings, section wrappers, nav anchors) but replaces hardcoded card markup with empty container divs:

```html
<div id="events-container"></div>
<div id="classes-sunday-container"></div>
<div id="classes-midweek-container"></div>
<div id="ministries-container"></div>
```

The hero title and subtitle are updated via `textContent` on existing elements (no container swap needed).

---

## 2. Watch Section Redesign

### Layout

```
┌─────────────────────────────────────────┐
│  Watch & Listen                         │
│  [subtitle]                             │
├─────────────────────────────────────────┤
│                                         │
│   [Rumble embed 16:9]                   │
│   — OR —                                │
│   [Next Service card]                   │
│                                         │
├─────────────────────────────────────────┤
│  Previous Sermons                       │
│  [thumb] [thumb] [thumb] [thumb] ...    │
└─────────────────────────────────────────┘
```

### Live State (rumbleEmbedId set)

Renders a 16:9 responsive Rumble iframe:
```html
<iframe src="https://rumble.com/embed/{rumbleEmbedId}/?pub=4" ...></iframe>
```

### Offline State (rumbleEmbedId null/empty)

Renders a styled "Next Service" card using the `nextService` string from `livestream.json`. Card matches the existing site card style (navy background, gold accent, centered text).

### YouTube Archive Grid

Renders cards from the `archive` array. Each card:
- YouTube thumbnail: `https://img.youtube.com/vi/{videoId}/mqdefault.jpg`
- Links to: `https://www.youtube.com/watch?v={videoId}`
- Shows title, date, pastor name
- Opens in new tab

"All Sermons on YouTube" button links to `youtubeChannelUrl`.

---

## 3. Livestream Workflow Skill

A Claude Code skill at `.claude/skills/manage-livestream.md` (or the project skills directory) covering:

**Pre-stream (before Sunday service):**
1. Get the Rumble video ID for the upcoming stream from Rumble Studio
2. Set `rumbleEmbedId` in `data/livestream.json`
3. Update `nextService` text if needed
4. Commit and push → Netlify deploys in ~30 seconds

**Post-stream:**
1. Clear `rumbleEmbedId` back to `null` in `data/livestream.json`
2. Add the new sermon to the top of the `archive` array with YouTube video ID, title, date, pastor
3. Commit and push

The skill will walk through each step with the exact JSON edits needed.

---

## 4. Auto-Upload to YouTube (External Workflow)

**Recommended approach: Rumble Studio Simulcast**

Rumble Studio has a built-in multistream feature. Configure YouTube as a simulcast destination using the YouTube RTMP stream key. From that point on, starting a stream in Rumble Studio automatically pushes to both Rumble and YouTube simultaneously — no downloads, no re-uploads, no scripts.

Setup (one-time):
1. YouTube Studio → Go Live → Stream → copy Stream Key
2. Rumble Studio → Settings → Multistream → add destination: `rtmp://a.rtmp.youtube.com/live2` + stream key
3. Test with a private stream

After each stream, YouTube automatically retains the recording as an unlisted/public video.

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `data/sermon.json` |
| Create | `data/events.json` |
| Create | `data/classes.json` |
| Create | `data/ministries.json` |
| Create | `data/livestream.json` |
| Modify | `js/main.js` — add all fetch+render logic |
| Modify | `index.html` — replace dynamic section markup with container divs, redesign Watch section |
| Create | `.claude/skills/manage-livestream.md` |
| Update | `.gitignore` — add `.superpowers/` |
