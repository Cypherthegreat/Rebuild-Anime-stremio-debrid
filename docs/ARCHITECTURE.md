# Architecture

## What repo do

Repo build and publish static files for Stremio addon around One Pace.

It pulls One Pace episode data, resolves torrent info, fills uncovered anime ranges with One Piece Kai, generates subtitle assets, then writes addon artifacts under repo.

Stremio-facing side in this repo is static:

- `manifest.json`
- `catalog/series/seriesCatalog.json`
- `meta/series/onepace.json`
- `stream/series/*.json`
- `static/*.srt`

No HTTP server entrypoint found in current tree.

## System shape

```text
Google Sheets + Nyaa + local subtitles repo + kai.json
                    |
                    v
             scripts/scrape.ts
              /       |       \
             v        v        v
      scripts/sheets  parse   subtitles
             \        |        /
              \       |       /
               v      v      v
          manifest/catalog/meta/stream/static
```

## Main parts

### 1. Source inputs

- Google Sheets episode sheet: arc + episode rows.
- Google Sheets description sheet: title/description enrichment.
- Nyaa pages/torrent downloads: resolve `infoHash` and `.torrent` file.
- `scripts/kai.json`: fallback dataset for One Piece Kai episodes.
- checked out subtitle repo under `scripts/subtitles/` during CI.
- `scripts/arcs.json`: arc title -> short prefix map for stable IDs.

### 2. Build code

- `scripts/scrape.ts`: top orchestrator.
- `scripts/sheets.ts`: fetch and normalize sheet data, cache Nyaa lookups.
- `scripts/parse.ts`: load torrent, find matching file by CRC32, build stream.
- `scripts/subtitles.ts`: convert `.ass` -> `.srt`, publish subtitle URLs.
- `scripts/utils.ts`: JSON I/O, logging, diff/update helpers, anime-range parsing.
- `scripts/types.ts`: shared shapes.

### 3. Generated outputs

- `catalog/series/seriesCatalog.json`: catalog entry list.
- `meta/series/onepace.json`: series metadata + full video index.
- `stream/series/<id>.json`: per-episode stream payload.
- `static/<id>_<lang>.srt`: generated subtitle files.
- `cache/`: runtime cache for Nyaa/torrent fetches.

## Key rules

- Episode IDs come from `arcs.json` prefix + `_` + episode number.
- One Pace episodes count as primary source.
- One Piece Kai fill only anime ranges not already covered by One Pace streams.
- Stream file exists only when torrent file match found.
- Subtitle files generated only when matching local `.ass` files exist.

## Important current-state note

README says fork adds debrid support, especially Torbox.

Current codebase does **not** show debrid provider code, Torbox integration, or provider-specific stream URL building. Current stream model is torrent-based: `infoHash`, optional `fileIdx`, optional subtitles.

Docs in this folder describe current code, not roadmap.
