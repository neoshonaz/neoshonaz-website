# Email-Triggered Content Editor — Design Spec
**Date:** 2026-04-14

## Overview

Approved senders can email a dedicated address to request changes to the website's JSON content files. The system validates the sender, interprets the request using the Claude API, commits the changes to a preview branch, opens a GitHub PR, and emails both the sender and the site owner with the Netlify preview URL for manual review and approval.

---

## Inbound Email Setup

- **Address:** `updates@mail.neoshonaz.com`
- **DNS:** A subdomain (`mail.neoshonaz.com`) is added in Porkbun with SendGrid's MX records. The main domain is untouched.
- **Format:** Plain English in the email body. No special syntax required.
  - Example: *"Add an event: Summer BBQ on July 4th at 3pm in the church parking lot"*
  - Example: *"Update the sermon series to Philippians"*
  - Example: *"Change the Hosea class leader to Pastor James only"*
- **Scope:** Claude may only edit the five content JSON files — `events.json`, `classes.json`, `ministries.json`, `sermon.json`, `livestream.json`. It cannot modify HTML, CSS, JS, or any other file.

---

## Approved Senders

- A fixed list of up to ~5 approved email addresses, stored as a Netlify environment variable (`APPROVED_SENDERS`).
- Each entry stores both the email address and a display name (e.g. `sarah@example.com:Sarah`).
- The list changes rarely; updating it requires editing the env variable in the Netlify dashboard.
- Unapproved senders are silently dropped — no bounce, no error, no response.

---

## Architecture

```
Approved sender
    │
    │  email to updates@mail.neoshonaz.com
    ▼
SendGrid Inbound Parse
    │
    │  POST (signed) to Netlify Function
    ▼
Netlify Function (gatekeeper)
    │  1. Verify SendGrid signature
    │  2. Verify secret token in URL
    │  3. Check sender against approved list
    │  4. Fire repository_dispatch to GitHub → return 200
    ▼
GitHub Actions Workflow (worker)
    │  1. Check out repo
    │  2. Read all five JSON files
    │  3. Call Claude API with email + JSON context
    │  4. Apply Claude's edits
    │  5. Create branch: preview/email-YYYYMMDD-HHMMSS
    │  6. Commit changes
    │  7. Open PR against master
    │  8. Send notification email via SendGrid
    ▼
Netlify (auto-deploys preview branch)
    │
    ▼
Site owner reviews preview → merges PR manually on GitHub
```

---

## Netlify Function (Gatekeeper)

- **Name:** Obfuscated (e.g. `inbound-xk9m2`) — not a guessable name
- **URL:** `/.netlify/functions/inbound-xk9m2?token=WEBHOOK_SECRET`
- **Security gates (all three must pass):**
  1. Query param `token` matches `WEBHOOK_SECRET` env variable
  2. SendGrid signature header is valid (verified with `SENDGRID_WEBHOOK_SIGNING_KEY` env variable)
  3. Sender email is in `APPROVED_SENDERS` env variable
- **On success:** Fires `repository_dispatch` event to GitHub with payload `{ sender_email, sender_name, subject, body }`
- **On any failure:** Returns `200` silently (never reveals why it rejected)
- **Type:** Standard Netlify Function (not background) — it only validates and dispatches, well within 10s

---

## GitHub Actions Workflow

**Trigger:** `repository_dispatch` with event type `email-content-edit`

**Steps:**

1. **Checkout** the repo at `master`
2. **Read JSON files** — all five content files are read into memory
3. **Call Claude API** — prompt includes:
   - The sender's name and the full email body
   - The contents of all five JSON files with their filenames
   - Strict instruction: return only the files that need changing, in valid JSON, no other output
   - Strict instruction: do not modify file structure, only content values
4. **Apply edits** — parse Claude's response, overwrite only the changed files
5. **Create branch** — `preview/email-YYYYMMDD-HHMMSS`
6. **Commit** — message format: `content: <brief summary from Claude>`
7. **Open PR** — against `master`, PR description includes the original email body
8. **Send notification email** via SendGrid to:
   - The original sender (by display name, not shown as email)
   - The site owner (hardcoded owner email in env var `OWNER_EMAIL`)
   - Email contains:
     - Sender's name and a plain-English summary of what changed
     - GitHub PR link
     - Netlify preview URL: `https://deploy-preview-{PR#}--{site-name}.netlify.app` (note: available ~2 min after PR opens)

---

## Environment Variables

All secrets stored in Netlify dashboard (for the Function) and GitHub repository secrets (for Actions). Nothing sensitive in the repo.

| Variable | Where | Purpose |
|---|---|---|
| `WEBHOOK_SECRET` | Netlify | Secret token in webhook URL |
| `SENDGRID_WEBHOOK_SIGNING_KEY` | Netlify | Verify inbound SendGrid signature |
| `GITHUB_PAT` | Netlify | PAT (from repo owner account) to fire `repository_dispatch` |
| `APPROVED_SENDERS` | Netlify | Comma-separated `email:Name` pairs |
| `SENDGRID_API_KEY` | GitHub Actions secrets | Send notification emails |
| `ANTHROPIC_API_KEY` | GitHub Actions secrets | Claude API access |
| `APPROVED_SENDERS` | GitHub Actions secrets | Same list — workflow needs sender's display name |
| `OWNER_EMAIL` | GitHub Actions secrets | Site owner's email for notifications |
| `NETLIFY_SITE_NAME` | GitHub Actions secrets | Used to construct preview URL |
| `GITHUB_TOKEN` | GitHub Actions (auto) | Auto-provided — used for commits and PRs |

---

## What Claude Can and Cannot Do

**Can:**
- Add, edit, or remove items within any of the five JSON files
- Interpret natural language and map it to the correct file and field

**Cannot:**
- Modify `index.html`, CSS, JS, or any non-JSON file
- Change the structure or schema of the JSON files (only values)
- Access external URLs or APIs
- Take any action outside of returning edited JSON content

---

## Manual Approval Flow

1. Site owner receives notification email with PR link and preview URL
2. Owner opens Netlify preview (~2 min after PR is opened)
3. If it looks correct: merge the PR on GitHub — Netlify auto-deploys to production
4. If it needs changes: close the PR and make edits manually, or reply to the sender to resend with corrections

No automated approval mechanism. No email-reply-to-approve. Deliberate.

---

## Out of Scope

- Automated approval or merge
- An admin UI for managing approved senders
- Image uploads or file uploads via email
- Any changes to website structure, layout, or code
