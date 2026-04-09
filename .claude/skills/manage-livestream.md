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

The website always shows the most recent Rumble embed. The embed ID stays set after the stream ends so visitors can watch the replay. It only changes when a new stream goes live.

## Before You Start

You need:
- The Rumble embed ID for the new stream
- (Post-stream only) The YouTube video ID of the recording

How to find the Rumble embed ID:
1. Go to Rumble Studio and start/schedule your stream
2. On the video page, click Share → Embed
3. The embed URL looks like: `https://rumble.com/embed/v1a2b3c/?pub=4p7fvy`
4. The ID is the part after `/embed/` and before `/?pub=` — e.g. `v1a2b3c`

---

## Pre-Stream Workflow (Going Live)

Run this ~5 minutes before the service starts.

**Step 1:** Open `data/livestream.json`

**Step 2:** Update `rumbleEmbedId` to the new stream's Rumble video ID:
```json
{
  "rumbleEmbedId": "v1a2b3c",
  "rumblePubId": "4p7fvy",
  ...
}
```

**Step 3:** Optionally update `nextService` to reflect the following week's service (this only shows if `rumbleEmbedId` is ever set to `null`).

**Step 4:** Commit and push:
```bash
git add data/livestream.json
git commit -m "live: update Rumble embed to [new video ID]"
git push
```

Netlify deploys in ~30 seconds. The website will now show the new live stream.

---

## Post-Stream Workflow (After Service Ends)

The Rumble embed stays — visitors can watch the replay. Just add the sermon to the YouTube archive.

**Step 1:** Find the YouTube video ID
- Go to YouTube Studio → Content → find today's video
- The video URL is `https://www.youtube.com/watch?v=VIDEOID` — copy the ID

**Step 2:** Open `data/livestream.json` and add the sermon to the TOP of the `archive` array:
```json
{
  "rumbleEmbedId": "v1a2b3c",
  "rumblePubId": "4p7fvy",
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

**Step 3:** Commit and push:
```bash
git add data/livestream.json
git commit -m "content: add [Sermon Title] to archive"
git push
```

---

## YouTube Simulcast Setup (One-Time)

To automatically record to YouTube when you stream on Rumble:

1. YouTube Studio → Go Live → Stream → copy your **Stream Key**
2. Rumble Studio → Settings → Multistream → Add Destination:
   - RTMP URL: `rtmp://a.rtmp.youtube.com/live2`
   - Stream Key: (paste from step 1)
3. Save and test with a private stream

After setup, every Rumble stream automatically records to YouTube — no manual upload needed.
