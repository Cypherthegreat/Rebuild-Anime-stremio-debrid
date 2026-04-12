# Docs

Docs for maintainers first.

## Truth first

- Repo look like static Stremio addon artifact generator, not live server app.
- Main flow: scrape source data -> write JSON artifacts -> host files.
- Current code uses torrent `infoHash` + optional `fileIdx`.
- Current code does **not** show Torbox or other debrid provider logic.

## Files here

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — big picture, moving parts, system shape.
- [`CODEMAP.md`](./CODEMAP.md) — where code live, what file do what.
- [`DATA-PIPELINE.md`](./DATA-PIPELINE.md) — update flow from source sheets to addon artifacts.
- [`OPERATIONS.md`](./OPERATIONS.md) — local run, CI, secrets, failure spots.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to change repo without breaking generated output.

## Fast read order

1. `ARCHITECTURE.md`
2. `CODEMAP.md`
3. `DATA-PIPELINE.md`
4. `OPERATIONS.md`
5. `CONTRIBUTING.md`
