# Email-Triggered Content Editor — Design Spec
**Date:** 2026-04-14

## Overview

Approved senders can email a dedicated address to request changes to the website's JSON content files. The system validates the sender, interprets the request using the Claude API, commits the changes to a preview branch, opens a GitHub PR, and emails both the sender and the site owner with a Netlify preview URL, step-by-step instructions, and a secure approve link. Either party can approve the merge without a GitHub account.

---

## Inbound Email Setup

- **Address:** `updates@mail.neoshonaz.com`
- **DNS:** A subdomain (`mail.neoshonaz.com`) is added in Porkbun with SendGrid's MX records. The main domain is untouched.
- **Format:** Plain English in the email body. No special syntax required. Images may be attached.
  - Example: *"Add an event: Summer BBQ on July 4th at 3pm in the church parking lot"*
  - Example: *"Update the sermon series to Philippians"*
  - Example: *"Change the Hosea class leader to Pastor James only"*
  - Example: *"Add this photo to the Kingdom Kids class"* (with image attached)
- **Scope:** Claude may only edit the five content JSON files and commit images to the `images/` folder. It cannot modify HTML, CSS, JS, or any other file.

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
    │  email (with optional image attachment) to updates@mail.neoshonaz.com
    ▼
SendGrid Inbound Parse
    │
    │  POST (signed) to Netlify Function (gatekeeper)
    ▼
Netlify Function — inbound (gatekeeper)
    │  1. Verify SendGrid signature
    │  2. Verify secret token in URL
    │  3. Check sender against approved list
    │  4. Auto-close any open PR from same sender
    │  5. Fire repository_dispatch to GitHub → return 200
    ▼
GitHub Actions Workflow (worker)
    │  1. Check out repo
    │  2. Read all five JSON files
    │  3. If image attached: save to images/, get path
    │  4. Call Claude API with email + JSON context + image path (if any)
    │  5. Apply Claude's edits to JSON files
    │  6. Create branch: preview/email-YYYYMMDD-HHMMSS
    │  7. Commit all changes
    │  8. Open PR against master
    │  9. Generate signed approve token
    │  10. Send notification email via SendGrid
    ▼
Netlify (auto-deploys preview branch)
    │
    ▼
Sender or owner clicks Approve link → Netlify Function (approver) merges PR
    │
    ▼
Netlify auto-deploys to production
```

---

## Netlify Function — Inbound (Gatekeeper)

- **Name:** Obfuscated (e.g. `inbound-xk9m2`) — not a guessable name
- **URL:** `/.netlify/functions/inbound-xk9m2?token=WEBHOOK_SECRET`
- **Security gates (all three must pass):**
  1. Query param `token` matches `WEBHOOK_SECRET` env variable
  2. SendGrid signature header is valid (verified with `SENDGRID_WEBHOOK_SIGNING_KEY` env variable)
  3. Sender email is in `APPROVED_SENDERS` env variable
- **On success:**
  - Calls GitHub API to close any open PRs with label `email-edit` from the same sender (auto-cleanup)
  - Fires `repository_dispatch` event to GitHub with payload `{ sender_email, sender_name, subject, body, attachments }`
  - Returns `200`
- **On any failure:** Returns `200` silently (never reveals why it rejected)
- **Type:** Standard Netlify Function — validates and dispatches only, well within 10s

---

## Netlify Function — Approver

- **Name:** Obfuscated (e.g. `approve-r7n4q`) — not a guessable name
- **URL:** `/.netlify/functions/approve-r7n4q?token=SIGNED_TOKEN&pr=PR_NUMBER`
- **How it works:**
  - The signed token is `HMAC-SHA256(secret + PR_number)` using `APPROVE_SECRET` env variable
  - Function verifies the HMAC, then calls GitHub API to merge the PR
  - If PR is already merged: returns a friendly "already merged" page
  - If token is invalid: silently returns `200` (no information leaked)
- **Result:** Sender or owner can approve from their email with one click — no GitHub account needed

---

## GitHub Actions Workflow

**Trigger:** `repository_dispatch` with event type `email-content-edit`

**Steps:**

1. **Checkout** the repo at `master`
2. **Read JSON files** — all five content files are read into memory
3. **Handle image attachment** (if present):
   - Decode the base64 attachment from the dispatch payload
   - Save to `images/` with a sanitized filename
   - Note the relative path for Claude's context
4. **Call Claude API** — prompt includes:
   - The sender's name and the full email body
   - The contents of all five JSON files with their filenames and schemas
   - The image path if one was saved (Claude places it in the correct JSON field)
   - Strict instruction: return only changed JSON files, valid JSON only, no other output
   - Strict instruction: do not modify file structure or schema — only values
5. **Apply edits** — parse Claude's response, overwrite only the changed files
6. **Create branch** — `preview/email-YYYYMMDD-HHMMSS`
7. **Commit** — message: `content: <brief summary from Claude>`; label PR `email-edit` with sender email in PR body (used for auto-close lookup)
8. **Open PR** — against `master`
9. **Generate approve link** — `HMAC-SHA256(APPROVE_SECRET + PR_number)` → signed URL
10. **Send notification email** via SendGrid to both the original sender and the site owner:

---

## Notification Email Format

**Subject:** `[Neosho Naz] Preview ready — <summary of change>`

**Body:**

> Hi [Sender Name],
>
> Your requested change has been processed. Here's what was updated:
>
> **[Plain-English summary from Claude]**
>
> ---
>
> **Step 1 — Review the preview**
> Open this link to see how the site looks with your changes (may take ~2 minutes to load):
> [Preview Link]
>
> **Step 2 — If everything looks correct, approve it**
> Click the button below to publish the changes to the live site:
> [Approve & Publish]
>
> **Step 3 — If something is wrong**
> Simply send a new email to updates@mail.neoshonaz.com describing the correction. Your previous change will be automatically cancelled and a new preview will be created.
>
> You can also view the full change on GitHub here: [PR Link]

---

## Image Handling

- Any image attached to an inbound email is extracted from the SendGrid payload
- Saved to `images/` in the repo with a sanitized, lowercase filename (e.g. `kingdom-kids-banner.jpg`)
- Claude is told the relative image path and instructed to place it in the most appropriate JSON field (e.g. an `image` field on the relevant class or event entry)
- Claude may not rename or move existing images — only add new ones
- Supported formats: JPEG, PNG, WebP, GIF

---

## Incorrect Edit Flow

When a sender's edit is wrong:
1. They send a new email describing the correction
2. The inbound function auto-closes their previous open PR (via the `email-edit` label + sender email in PR body)
3. A fresh branch and PR are created from the new email
4. A new notification email is sent

No manual cleanup needed on the sender's end.

---

## Environment Variables

All secrets stored in Netlify dashboard (for Functions) and GitHub repository secrets (for Actions). Nothing sensitive in the repo.

| Variable | Where | Purpose |
|---|---|---|
| `WEBHOOK_SECRET` | Netlify | Secret token in webhook URL |
| `SENDGRID_WEBHOOK_SIGNING_KEY` | Netlify | Verify inbound SendGrid payload signature |
| `GITHUB_PAT` | Netlify | PAT (repo owner account) — fires `repository_dispatch` and closes PRs |
| `APPROVE_SECRET` | Netlify + GitHub Actions secrets | HMAC secret for signing/verifying approve tokens |
| `APPROVED_SENDERS` | Netlify | Comma-separated `email:Name` pairs |
| `NETLIFY_SITE_NAME` | Netlify | Used to construct approve function URL |
| `SENDGRID_API_KEY` | GitHub Actions secrets | Send notification emails |
| `ANTHROPIC_API_KEY` | GitHub Actions secrets | Claude API access |
| `APPROVED_SENDERS` | GitHub Actions secrets | Same list — workflow needs sender's display name |
| `OWNER_EMAIL` | GitHub Actions secrets | Site owner's email for notifications |
| `NETLIFY_SITE_NAME` | GitHub Actions secrets | Used to construct Netlify preview URL |
| `GITHUB_TOKEN` | GitHub Actions (auto) | Auto-provided — used for commits and opening PRs |

---

## What Claude Can and Cannot Do

**Can:**
- Add, edit, or remove items within any of the five JSON files
- Interpret natural language and map it to the correct file and field
- Place an attached image path into the correct JSON field

**Cannot:**
- Modify `index.html`, CSS, JS, or any non-JSON file
- Change the structure or schema of the JSON files (only values)
- Rename or move existing images
- Access external URLs or APIs
- Take any action outside of returning edited JSON and saving an image

---

## Out of Scope

- An admin UI for managing approved senders
- Any changes to website structure, layout, or code
- Multi-image attachments per email (one image per email)
