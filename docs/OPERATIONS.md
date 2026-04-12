# Operations

## Local run

### Need

- Bun `1.3.8`
- Node tooling good enough for `ts-node`
- FFmpeg installed
- Google API key in env as `GOOGLE_API_KEY`
- subtitle repo checked out under `scripts/subtitles/`

Without subtitle checkout, subtitle generation part fail.

### Commands

```bash
bun install --frozen-lockfile
bun run scrape
```

Available package scripts now:

- `format`
- `scrape`

No test, lint, or explicit typecheck script exists.

## CI / automation

Main automation file: `.github/workflows/update.yaml`

### Scrape job

- checkout repo
- checkout `one-pace/one-pace-public-subtitles` into `scripts/subtitles`
- setup Node
- setup Bun `1.3.8`
- setup FFmpeg
- install deps
- restore `cache/`
- run scrape with `GOOGLE_API_KEY`
- save `cache/`
- auto-commit generated changes to repo

### Notify job

If scrape job produced message, send Matrix update.

## Secrets and vars

Used in workflow:

- `GOOGLE_API_KEY`
- `MATRIX_ACCESS_TOKEN`
- `MATRIX_SERVER`
- `MATRIX_ROOM_ID`

## Output model

Repo itself stores generated artifacts.

That means `main` can change often and diffs may be noisy because many JSON/SRT files are build output.

## Likely hosting model

Files `CNAME` and `.nojekyll` strongly suggest static hosting, likely GitHub Pages or similar static publish flow.

Manifest and subtitle URLs point at `https://onepace.arl.sh/`.

## Main failure spots

- Google Sheets schema/content changes
- Nyaa page format or availability changes
- subtitle repo layout changes
- FFmpeg missing or failing conversion
- new arc title missing from `scripts/arcs.json`
- KAI arc name drift vs sheet arc names

## Fast maintainer checks after scrape

- `meta/series/onepace.json` still valid and updated
- changed `stream/series/*.json` look sane
- `static/*.srt` generated for episodes that should have subtitles
- no unexpected mass deletions
- README/docs still match code truth

## Current truth note

Current repo automation updates torrent-backed addon artifacts.

No Torbox/debrid runtime found in code at time of writing.
