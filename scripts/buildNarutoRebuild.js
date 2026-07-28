const fs = require("fs");
const path = require("path");
const parseTorrent = require("parse-torrent");

const ROOT_DIR = path.resolve(__dirname, "..");
const TORRENT_PATH = path.join(ROOT_DIR, "Rebuild_of_Naruto.torrent");
const META_DIR = path.join(ROOT_DIR, "meta", "series");
const STREAM_DIR = path.join(ROOT_DIR, "stream", "series");

const SERIES_ID = "narutorebuild";
const RELEASED_AT = "2023-01-01T00:00:00.000Z";

const seasonMap = {
  NARUTO: { season: 1, name: "Naruto" },
  "NARUTO GAIDEN": { season: 2, name: "Naruto Gaiden" },
  "KAKASHI GAIDEN": { season: 3, name: "Kakashi Gaiden" },
  "NARUTO SHIPPUDEN": { season: 4, name: "Naruto Shippuden" },
  "NARUTO SENJOU": { season: 5, name: "Naruto Senjou" },
  "NARUTO HIDEN": { season: 6, name: "Naruto Hiden" },
  "NEXT GENERATIONS": { season: 7, name: "Next Generations" },
  "ITACHI SHINDEN": { season: 8, name: "Itachi Shinden" }
};

const supportedVideoExtensions = new Set([
  ".mkv",
  ".mp4",
  ".avi",
  ".webm",
  ".mov",
  ".m4v"
]);

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function removeOldNarutoStreamFiles() {
  if (!fs.existsSync(STREAM_DIR)) {
    return;
  }

  for (const filename of fs.readdirSync(STREAM_DIR)) {
    if (/^NR\d{4}[a-z]?\.json$/i.test(filename)) {
      fs.unlinkSync(path.join(STREAM_DIR, filename));
    }
  }
}

function getPartOrder(part) {
  return part ? part.charCodeAt(0) : 0;
}

function parseEpisode(file, fileIdx) {
  const normalizedPath = file.path.replace(/\\/g, "/");
  const filename = path.posix.basename(normalizedPath);
  const extension = path.posix.extname(filename).toLowerCase();

  if (!supportedVideoExtensions.has(extension)) {
    return null;
  }

  /*
   * Supports folder structures such as:
   * [01] SET 1 - NARUTO/Arc 1 - Childhood/Naruto 1a - Academy Days [4.3] (1080p).mkv
   * [06] EXTRA - ITACHI SHINDEN/Arc .../Itachi Shinden 1a - Death and Rebirth [4.3] (1080p).mkv
   */
  const setMatch = normalizedPath.match(
    /\[\d+\]\s+(?:SET\s+\d+\s+-\s+|EXTRA\s+-\s+)(.+?)(?:\/|$)/i
  );

  const setName = setMatch?.[1]?.trim().toUpperCase();
  const seasonInfo = seasonMap[setName];

  if (!seasonInfo) {
    console.warn(`Skipping unknown set: ${setName || "unknown"}`);
    console.warn(`  ${normalizedPath}`);
    return null;
  }

  /*
   * Supports:
   * Naruto 1a - Academy Days [4.3] (1080p).mkv
   * Naruto Shippuden 2b - Rescue the Kazekage [4.3] (1080p).mkv
   */
  const episodeMatch = filename.match(
    /^(.+?)\s+(\d+)([a-z])?\s+-\s+(.+?)(?:\s*\[\d+(?:\.\d+)?\])?(?:\s*\(\d+p\))?\.(?:mkv|mp4|avi|webm|mov|m4v)$/i
  );

  if (!episodeMatch) {
    console.warn(`Skipping unparseable filename: ${filename}`);
    return null;
  }

  const seriesLabel = episodeMatch[1].trim();
  const sourceEpisode = Number.parseInt(episodeMatch[2], 10);
  const part = (episodeMatch[3] || "").toLowerCase();
  const episodeTitle = episodeMatch[4].trim();

  const id =
    `NR${String(seasonInfo.season).padStart(2, "0")}` +
    `${String(sourceEpisode).padStart(2, "0")}` +
    part;

  return {
    id,
    season: seasonInfo.season,
    seasonName: seasonInfo.name,
    sourceEpisode,
    part,
    title: `${seriesLabel} ${sourceEpisode}${part} - ${episodeTitle}`,
    fileIdx,
    filename,
    size: file.length,
    path: normalizedPath
  };
}

if (!fs.existsSync(TORRENT_PATH)) {
  throw new Error(`Torrent file not found: ${TORRENT_PATH}`);
}

const torrentBuffer = fs.readFileSync(TORRENT_PATH);
const torrent = parseTorrent(torrentBuffer);

if (!torrent.infoHash || !Array.isArray(torrent.files) || torrent.files.length === 0) {
  throw new Error("Torrent parsing failed: no info hash or files were found.");
}

console.log("Building Rebuild of Naruto Stremio files...");
console.log(`Torrent name: ${torrent.name || "Unknown"}`);
console.log(`Info hash: ${torrent.infoHash}`);
console.log(`Torrent files: ${torrent.files.length}`);

const episodes = torrent.files
  .map((file, fileIdx) => parseEpisode(file, fileIdx))
  .filter(Boolean)
  .sort((a, b) => {
    if (a.season !== b.season) {
      return a.season - b.season;
    }

    if (a.sourceEpisode !== b.sourceEpisode) {
      return a.sourceEpisode - b.sourceEpisode;
    }

    return getPartOrder(a.part) - getPartOrder(b.part);
  });

if (episodes.length === 0) {
  throw new Error(
    "No video files were recognised. Check the torrent folder and filename formats."
  );
}

const duplicateIds = episodes.filter(
  (episode, index, allEpisodes) =>
    allEpisodes.findIndex((item) => item.id === episode.id) !== index
);

if (duplicateIds.length > 0) {
  const ids = [...new Set(duplicateIds.map((episode) => episode.id))];
  throw new Error(`Duplicate Naruto video IDs found: ${ids.join(", ")}`);
}

/*
 * Stremio needs a distinct numeric episode value within each season.
 * The source's lettered parts (e.g. 5a–5f) are retained in the title and ID,
 * but become sequential Stremio episodes for reliable display and playback.
 */
const nextEpisodeBySeason = new Map();

for (const episode of episodes) {
  const nextEpisode = (nextEpisodeBySeason.get(episode.season) || 0) + 1;
  nextEpisodeBySeason.set(episode.season, nextEpisode);
  episode.stremioEpisode = nextEpisode;
}

ensureDirectory(META_DIR);
ensureDirectory(STREAM_DIR);
removeOldNarutoStreamFiles();

const metaResponse = {
  meta: {
    id: SERIES_ID,
    type: "series",
    name: "Rebuild of Naruto",
    poster:
      "https://image.tmdb.org/t/p/w600_and_h900_face/1GVfX7kqIbQBp38Riiy1QLQkhJQ.jpg",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/c/c9/Naruto_logo.svg",
    background:
      "https://wallpaperaccess.com/full/246648.jpg",
    posterShape: "poster",
    genres: ["Action", "Adventure", "Anime"],
    releaseInfo: "2023",
    description:
      "Rebuild of Naruto is a condensed fan edit of the Naruto anime.",
    videos: episodes.map((episode) => ({
      id: episode.id,
      title: episode.title,
      season: episode.season,
      episode: episode.stremioEpisode,
      released: RELEASED_AT,
      available: true
    }))
  }
};

const metaPath = path.join(META_DIR, `${SERIES_ID}.json`);

fs.writeFileSync(metaPath, JSON.stringify(metaResponse, null, 2), "utf8");

for (const episode of episodes) {
  const streamResponse = {
    streams: [
      {
        infoHash: torrent.infoHash,
        fileIdx: episode.fileIdx
      }
    ]
  };

  const streamPath = path.join(STREAM_DIR, `${episode.id}.json`);

  fs.writeFileSync(
    streamPath,
    JSON.stringify(streamResponse, null, 2),
    "utf8"
  );
}

console.log("");
console.log(`Generated ${episodes.length} Naruto videos.`);
console.log(`Metadata: ${path.relative(ROOT_DIR, metaPath)}`);
console.log(`Streams: ${path.relative(ROOT_DIR, STREAM_DIR)}`);
console.log("");
console.log("Season breakdown:");

for (const [season, count] of [...nextEpisodeBySeason.entries()].sort(
  ([a], [b]) => a - b
)) {
  console.log(`  Season ${season}: ${count} episodes`);
}