# Kylo's World

A personal website for Kylo — photos, milestones, and letters, all in one place for him to find someday.

## Running locally

```bash
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

1. Push this folder to a GitHub repository
2. Go to vercel.com, click "Add New Project", import the repo
3. Deploy — no extra configuration needed

## How to add content

### Update Kylo's profile

Edit `lib/config.ts` to change his name, birthdate, bio, or hero photo path.

To swap in a real hero photo: drop the image in `public/images/`, then update `heroImage` in `lib/config.ts` to `/images/your-photo.jpg`.

---

### Add a journal letter

Create a new `.mdx` file in `content/journal/` named `YYYY-MM-DD-short-title.mdx`:

```
---
title: "Your First Steps"
date: "2026-03-15"
author: "Dad"
excerpt: "Today you walked across the living room all by yourself..."
---

Dear Kylo,

Your letter here...
```

The slug (URL) is derived from the filename. `2026-03-15-first-steps.mdx` → `/journal/first-steps`.

---

### Add a timeline milestone

Open `content/events/events.json` and add an entry to the array:

```json
{
  "id": "first-steps",
  "date": "2026-03-15",
  "title": "First Steps",
  "category": "milestone",
  "note": "Walked across the living room. We cried. Obviously."
}
```

`category` options: `milestone` · `first` · `medical` · `trip` · `birthday`

---

### Add a photo album

1. Create a folder in `content/gallery/` named after the album slug, e.g. `month-01`
2. Create `content/gallery/month-01/album.json`:

```json
{
  "slug": "month-01",
  "title": "Month One",
  "date": "2025-06-26",
  "description": "A whole month in.",
  "coverPhoto": "001.jpg",
  "photos": [
    { "filename": "001.jpg", "caption": "Sleeping in the sun.", "width": 3024, "height": 4032 },
    { "filename": "002.jpg", "caption": "Bath time.", "width": 4032, "height": 3024 }
  ]
}
```

3. Put the actual image files in `public/images/month-01/` — filenames must match what's in `album.json`

**Important:** `width` and `height` must match the real pixel dimensions of each photo. You can find these in the photo's info panel in Finder (Get Info → More Info).

---

## Project structure

```
content/          — all written content (edit this)
  journal/        — MDX letter files
  events/         — events.json milestone list
  gallery/        — album.json files per album
public/images/    — photo files (mirrors gallery folder names)
lib/config.ts     — site-wide settings (name, birthdate, bio)
```

