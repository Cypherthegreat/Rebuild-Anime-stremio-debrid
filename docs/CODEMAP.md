# Codemap

## Top level

- `README.md` — user-facing project story and install notes.
- `manifest.json` — Stremio addon manifest.
- `catalog/` — generated catalog payload.
- `meta/` — generated series metadata payload.
- `stream/` — generated per-episode stream payloads.
- `static/` — generated subtitle files served by URL.
- `scripts/` — all build/update logic.
- `.github/workflows/update.yaml` — hourly + push + manual automation.
- `package.json` — Bun/TS toolchain, only `format` and `scrape` scripts.
- `tsconfig.json` — strict TS, `nodenext`, JSON imports.
- `CNAME`, `.nojekyll` — strong sign repo meant for static hosting.

## `scripts/`

- `scrape.ts`
  - repo entrypoint.
  - fetches arcs.
  - builds videos/streams for One Pace.
  - fills uncovered ranges from KAI.
  - removes stale stream files.
  - writes final `meta/series/onepace.json`.

- `sheets.ts`
  - talks to Google Sheets API.
  - reads main episode spreadsheet and description spreadsheet.
  - resolves Nyaa URL -> `infoHash` + torrent URL.
  - stores lookup cache in `cache/nyaa.json`.

- `parse.ts`
  - downloads or reuses cached `.torrent` file.
  - parses torrent contents.
  - finds matching media file by CRC32 suffix.
  - builds `Stream` with `infoHash`, optional `fileIdx`, subtitles.

- `subtitles.ts`
  - scans checked out subtitle repo.
  - matches files by arc title + episode number.
  - converts `.ass` -> `.srt` with FFmpeg.
  - strips inline style comments.
  - emits public subtitle URLs under `static/`.

- `utils.ts`
  - JSON read/write.
  - logging with elapsed time.
  - arc prefix lookup.
  - anime range parsing.
  - diff/save logic for video and stream updates.

- `types.ts`
  - `Arc`, `Episode`, `Download`, `Video`, `Stream`, `Subtitle`.

- `arcs.json`
  - source of stable arc prefixes like `RO`, `AL`, `WA`.

- `kai.json`
  - static One Piece Kai fallback dataset.
  - includes shared KAI torrent `infoHash` and episode metadata.

## Where to change what

- Add new arc prefix rule -> `scripts/arcs.json`
- Change primary source ingest -> `scripts/sheets.ts`
- Change torrent match logic -> `scripts/parse.ts`
- Change KAI fallback behavior -> `scripts/scrape.ts` + `scripts/kai.json`
- Change subtitle matching/output -> `scripts/subtitles.ts`
- Change artifact write/update logic -> `scripts/utils.ts`
- Change CI schedule/secrets/commit flow -> `.github/workflows/update.yaml`
- Change addon identity/resources -> `manifest.json`

## What not to look for here

- No `src/` app.
- No HTTP route handlers.
- No test suite.
- No lint config.
- No visible Torbox/debrid implementation in current tree.
