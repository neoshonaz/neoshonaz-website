# Neosho Church of the Nazarene — Website Design
**Date:** 2026-03-20
**Status:** Approved

## Overview
Full modernization of neoshonaz.org. Single-page site with anchor navigation. Plain HTML/CSS/JS, no framework, no build step. Hosted on Netlify (free tier). Content hardcoded in HTML to start; can be moved to JSON later for AI-agent or CMS updates.

## Visual Identity
- **Primary color:** Deep navy (#1a2744 or similar)
- **Accent:** Warm gold (#c9a84c or similar)
- **Background:** White / light gray (#f8f9fa)
- **Typography:** Inter (Google Fonts)
- **Style:** Card-based, generous whitespace, mobile-first responsive, smooth scroll

## Page Structure

### 1. Sticky Navigation
- Logo/church name left
- Anchor nav links right: Home · Events · Classes · Ministries · Leadership · Watch · I'm New · Contact
- "Give" CTA button (links to ChurchCenter)
- Hamburger menu on mobile

### 2. Hero
- Full-width background (dark overlay on photo or gradient)
- Church name headline
- Current sermon series title (large, prominent)
- Two service time cards: 8:00 AM (Traditional) · 10:30 AM (Blended)
- Wednesday 7:00 PM note
- CTAs: "I'm New" (scrolls to section) · "Watch Live" (scrolls to watch section)

### 3. Events
- Responsive card grid
- Each card: date badge, event title, short description, optional link

### 4. Classes
- Card grid: Sunday School (9:30 AM) · Adult Bible Study · Youth (Testify) · Kingdom Kids · Faith Foundations

### 5. Ministries
- Image/icon cards: Testify Youth · Faith Foundations · Kingdom Kids · Global Nazarene

### 6. Leadership
- Uniform-size photo grid
- Each card: photo, name, title, email, phone
- Staff: Rev. James Keezer (Senior Pastor), Rev. Justin Couch (Associate Pastor), Beau & Lauren Davis (Youth Pastors), + others from current site

### 7. Watch / Sermons
- Latest sermon embed (YouTube or Facebook Live iframe)
- Scrollable archive grid of previous sermons with thumbnails and titles

### 8. I'm New
- Three cards: Where & When · What to Expect · Worship Style
- Friendly, welcoming tone

### 9. What We Believe
- Brief statement about faith
- Link to official Church of the Nazarene Articles of Faith (nazarene.org)

### 10. Contact
- Three columns: Address + hours · Phone & email · Google Maps iframe embed
- Address: 1045 Fairhill Dr, Neosho, MO 64850

### 11. Footer
- Address, Facebook link, quick nav links, Give button

## File Structure
```
index.html
css/
  style.css
js/
  main.js
images/
  (leadership photos, hero background, ministry images)
docs/
  plans/
    2026-03-20-church-website-design.md
```

## Future Content Management
Content is hardcoded in HTML for now. The structure is designed to be easily migrated to:
- JSON data files + JS fetch() rendering (for AI-agent email updates)
- Decap CMS (for a web-based admin panel)
