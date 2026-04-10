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

### Email-to-PR Content Editing (waiting on domain transfer)
- [ ] Domain transfer from Sharefaith → Porkbun finalizes
- [ ] Create SendGrid account and enable Inbound Parse
- [ ] Add subdomain (e.g. `updates.yourdomain.com`) in Porkbun DNS
- [ ] Point subdomain MX records to SendGrid
- [ ] Create skills: `github-api` and `sendgrid-inbound-parse`
- [ ] Create `neoshonaz-update-router` skill adapted from `faithsw-update-router` in `faithsw-skills/` (use as reference for parsing free-form email content and routing to the correct JSON file)
- [ ] Build Netlify Function (`netlify/functions/content-update.js`):
  - Verify sender is on approved list
  - Parse email body with Claude API (`claude-haiku-4-5`)
  - Read current JSON files from GitHub API
  - Write updated JSON back via GitHub API on a new branch
  - Open PR via GitHub API
  - Send confirmation email (PR link + Netlify preview URL) to sender and admin
- [ ] Add environment variables in Netlify:
  - `SENDGRID_API_KEY`
  - `GITHUB_TOKEN` (fine-grained PAT: contents read/write, pull requests write)
  - `ANTHROPIC_API_KEY`
  - `APPROVED_SENDERS` (comma-separated list)
  - `ADMIN_EMAIL`
- [ ] Test end-to-end: send a test email → verify PR + preview link arrives
- [ ] Add approved sender emails for all content editors

### Nice to Have
- [ ] Add hero background image (`images/church-building.jpg` is available)
- [ ] Fill in phone number in contact section (currently commented out)
