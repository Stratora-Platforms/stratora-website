# Carousel screenshots

Recaptures the eight app screenshots behind **See Stratora in action** on the
homepage, at 1920×1080, straight into `public/screenshots/`.

Lives in its own package on purpose: Playwright's postinstall downloads ~150 MB
of browsers, and the Pages deploy runs `npm install` at the repo root. Keeping it
here means CI never sees it.

## Setup (once)

```bash
cd tools/screenshots
npm run setup          # installs Playwright + its Chromium
cp .env.example .env   # then fill in STRATORA_PASS
```

## Run

```bash
npm run capture                              # all eight
node capture.mjs --only alerts.png,ipam.png  # just those
node capture.mjs --dry-run                   # print the plan, write nothing
node capture.mjs --headed                    # watch it drive the browser
```

Then check the diff, eyeball the carousel with `npm run dev` at the repo root,
and commit the PNGs.

## What it shoots

Driven entirely by `shots.config.json`. The eight files map 1:1 onto the
`SCREENSHOTS` array in `src/app/components/screenshot-gallery.tsx` — if you add
a slide there, add an entry here with the same filename.

Pages are targeted **by name**, not by UUID: dashboards, maps, sites and racks
all have generated IDs in their URLs, so the script opens the index page and
clicks the card whose heading matches `pick`. Re-seeding the dev box changes the
IDs but not the names.

When a name changes, the run fails with the list of headings it actually found
on that index page — paste the right one into `pick`.

## Notes

- The session is cached in `.auth.json`, so repeat runs skip the login form.
  Delete it, or pass `--keep-auth=false`, to sign in fresh.
- `.env` and `.auth.json` are gitignored. Don't commit either.
- Captures run with `reducedMotion: "reduce"` so panels are settled rather than
  caught mid-transition.
- `settleMs` per shot is the escape hatch for anything that animates in late —
  Leaflet maps and the donut charts are the slow ones. Bump it if a shot lands
  half-drawn.
- The carousel thumbnails are `aspect-video object-cover object-top`, so 16:9 is
  the right shape and the top of each frame is what shows in the strip.
