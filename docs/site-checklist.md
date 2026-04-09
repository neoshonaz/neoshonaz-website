# Neosho Naz Website — Checklist & Next Steps

## Done ✅

- [x] Built single-page website (HTML/CSS/JS, no framework)
- [x] JSON content system — Events, Sermon Hero, Classes, Ministries all driven by `data/` files
- [x] Watch section — Rumble live embed + YouTube archive grid
- [x] Next Service card (shows when no embed is set)
- [x] `manage-livestream` skill for weekly stream workflow
- [x] Pushed to `neoshonaz/neoshonaz-website` on GitHub

## To Do 🔲

### Deploy
- [ ] Connect `neoshonaz/neoshonaz-website` to Netlify
  - Netlify → Add new site → Import from GitHub → pick `neoshonaz/neoshonaz-website` → Deploy

### Streaming
- [ ] Set up YouTube simulcast in Rumble Studio (one-time)
  - Rumble Studio → Settings → Multistream → Add `rtmp://a.rtmp.youtube.com/live2` + YouTube stream key
- [ ] Each week before service: update `rumbleEmbedId` in `data/livestream.json` with new stream ID
- [ ] Each week after service: add YouTube video ID to `archive` array in `data/livestream.json`

### Content
- [ ] Update `data/events.json` with events after the garage sale (Apr 10–11)
- [ ] Add individual staff email addresses to leadership section in `index.html`
  - Currently all show `neoshonazarene@yahoo.com` as placeholder

### Nice to Have
- [ ] Add hero background image (`images/church-building.jpg` is available)
- [ ] Fill in phone number in contact section (currently commented out)
