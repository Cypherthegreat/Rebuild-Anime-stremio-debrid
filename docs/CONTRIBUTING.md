# Contributing

## Before change

Read in this order:

1. `ARCHITECTURE.md`
2. `CODEMAP.md`
3. `DATA-PIPELINE.md`
4. `OPERATIONS.md`

## Setup

Need:

- Bun `1.3.8`
- FFmpeg
- `GOOGLE_API_KEY`
- subtitle repo at `scripts/subtitles/`

Then:

```bash
bun install --frozen-lockfile
bun run scrape
```

## Safe change rules

- Treat `scripts/` as source of truth.
- Treat `catalog/`, `meta/`, `stream/`, `static/` as generated output.
- Do not rename arc titles lightly; many joins depend on exact title match.
- If new arc appears, update `scripts/arcs.json`.
- If source format changes, fix parser first, not generated JSON by hand.
- If README promise and code truth differ, update docs or code so both match.

## When changing specific areas

### Source ingest

Edit `scripts/sheets.ts`.

Watch for:

- sheet IDs
- range selection
- hyperlink format
- Nyaa parsing regex

### Stream generation

Edit `scripts/parse.ts` and maybe `scripts/utils.ts`.

Watch for:

- CRC32 file match rule
- `fileIdx` handling
- cache behavior

### KAI fallback

Edit `scripts/scrape.ts` and `scripts/kai.json`.

Watch for:

- anime coverage math
- arc name alignment
- synthetic episode numbering

### Subtitles

Edit `scripts/subtitles.ts`.

Watch for:

- local subtitle path
- filename match pattern
- FFmpeg conversion
- public URL base

### CI

Edit `.github/workflows/update.yaml`.

Watch for:

- hourly schedule
- cache keys
- required secrets
- auto-commit behavior

## Validation now

Repo has no test suite and no lint script.

So minimum validation is:

1. run scrape
2. inspect generated diff
3. check docs still true
4. spot-check few stream and subtitle outputs

## Important mismatch already present

README says fork adds debrid support, especially Torbox.

Current code in repo does not show that implementation yet. Be careful not to document future state as current state.
