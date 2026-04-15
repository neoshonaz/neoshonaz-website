# Decap CMS Content Editor — Design Spec
**Date:** 2026-04-14

## Overview

Add Decap CMS to the Neosho Church of the Nazarene website so that up to 5 approved editors can manage all JSON-driven content through a visual admin interface at `neoshonaz.org/admin`. Changes go through an editorial workflow (Draft → In Review → Ready → Publish) with a live preview pane, before being merged to master and deployed to production. No GitHub account required for editors.

---

## Authentication & Access

- **Provider:** Netlify Identity (free tier, included with Netlify)
- **Git proxy:** Git Gateway (free Netlify service) — allows Decap to commit to GitHub on editors' behalf without them needing GitHub accounts
- **Editor onboarding:** Site owner invites editors by email from the Netlify dashboard. Editors receive a link, set a password, and are ready to log in.
- **Capacity:** Up to 5 invited users on the free tier
- **Admin URL:** `neoshonaz.org/admin`

---

## Files Added to Repo

```
admin/
├── index.html    ← loads Decap CMS; registers preview templates
└── config.yml    ← defines collections, fields, and editorial workflow
```

No existing files are modified. The `data/` JSON files and all site HTML/CSS/JS remain unchanged.

---

## Collections

Each JSON file maps to one Decap collection. Field types enforce correct data entry — editors fill in forms, not raw JSON.

### Events (`data/events.json`)
List collection — each item is an event.

| Field | Type | Notes |
|---|---|---|
| `title` | String | Event name |
| `date` | Date | Date picker |
| `time` | String | e.g. "3:00 PM" |
| `description` | Text | Multi-line |
| `image` | Image | Optional, saved to `images/` |

### Classes — Sunday School (`data/classes.json` → `sundaySchool`)
List collection — each item is a Sunday School class.

| Field | Type | Notes |
|---|---|---|
| `title` | String | Class name |
| `description` | Text | Supports basic HTML (bold, links) |
| `leader` | String | Optional, e.g. "Led by Patrick McNeill" |
| `time` | String | e.g. "Sundays · 9:30 AM" |
| `icon` | String | Optional icon character |

### Classes — Midweek (`data/classes.json` → `midweek`)
Same fields as Sunday School.

### Ministries (`data/ministries.json`)
List collection — each item is a ministry.

| Field | Type | Notes |
|---|---|---|
| `title` | String | Ministry name |
| `description` | Text | |
| `color` | Color | Hex color picker |
| `icon` | String | Optional icon character |
| `link` | String | Optional URL |
| `linkText` | String | Optional link label |

### Sermon Series (`data/sermon.json`)
Single-item collection — one current series at a time.

| Field | Type | Notes |
|---|---|---|
| `series` | String | Series name, e.g. "Romans" |
| `subtitle` | Text | Description of the series |

### Livestream (`data/livestream.json`)
Single-item collection.

| Field | Type | Notes |
|---|---|---|
| `rumbleEmbedId` | String | Rumble embed ID |
| `rumblePubId` | String | Rumble publisher ID |
| `nextService` | String | e.g. "Join us this Sunday at 10:30 AM" |
| `youtubeChannelUrl` | String | YouTube channel URL |

---

## Editorial Workflow

Enabled globally in `config.yml` with `publish_mode: editorial_workflow`.

```
Draft → In Review → Ready → Published
```

- **Draft:** Editor saves a change. Decap commits to a new branch. Netlify auto-builds a deploy preview.
- **In Review:** Editor (or owner) drags the card on the Workflow Kanban board to signal it's ready to check.
- **Ready:** Reviewed and approved — ready to go live.
- **Published:** Editor or owner clicks Publish. Decap merges the branch to master. Netlify deploys to production (~1 min).

All status changes happen within the `/admin` UI. No GitHub interaction required from editors.

---

## Preview Templates

A preview template is registered in `admin/index.html` for each collection. It renders the current form field values in a styled component matching the live site, visible in the right-hand pane of the editor — updating live as the editor types.

One template per collection:
- **Events** — renders an event card
- **Sunday School classes** — renders a class card
- **Midweek classes** — renders a class card
- **Ministries** — renders a ministry card with color accent
- **Sermon Series** — renders the sermon series section
- **Livestream** — renders the nextService text and embed placeholder

Templates use plain JavaScript and inline styles. No build step required.

---

## Image Handling

- Collections that support images (Events, Ministries) include an Image field
- Editors click the field, upload from their device — Decap saves the file to `images/` in the repo automatically
- Image field is optional on all collections — leaving it blank is valid
- No manual file management needed

---

## What Editors Can Do

- Add, edit, reorder, or delete items in any collection
- Upload images directly from the form
- Preview changes live before saving
- Move drafts through the workflow board
- Publish approved changes with one click

## What Editors Cannot Do

- Edit HTML, CSS, or JavaScript
- Change the structure of the JSON files (fields are fixed by `config.yml`)
- Access the GitHub repository
- Publish without going through the Draft → Ready workflow

---

## Out of Scope

- Custom roles (all invited editors have the same permissions)
- Email notifications when drafts are created or published
- Any changes to the public site's HTML/CSS/JS structure
