#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const parseTorrent = require("parse-torrent");

const torrentPath = path.resolve(__dirname, "..", "Rebuild_of_Naruto.torrent");
const buffer = fs.readFileSync(torrentPath);
const parsed = parseTorrent(buffer);

console.log("Building Naruto Rebuild metadata...");
console.log("Info Hash:", parsed.infoHash);

const episodes = [];

parsed.files.forEach((file, idx) => {
  const normalizedPath = file.path.replace(/\\/g, "/");

  // Extract set name from folder structure
  const setMatch = normalizedPath.match(/\[(\d+)\] SET (\d+) - (.+?)(?=\\|\/)/);
  const extraMatch = normalizedPath.match(/EXTRA - (.+?)(?=\\|\/)/);
  const setName = (setMatch && setMatch[3]) || (extraMatch && extraMatch[1]) || "";

  const seasonMap = {
    "NARUTO": { season: 1, name: "Naruto" },
    "NARUTO GAIDEN": { season: 2, name: "Naruto Gaiden" },
    "KAKASHI GAIDEN": { season: 3, name: "Kakashi Gaiden" },
    "NARUTO SHIPPUDEN": { season: 4, name: "Naruto Shippuden" },
    "NARUTO SENJOU": { season: 5, name: "Naruto Senjou" },
    "NARUTO HIDEN": { season: 6, name: "Naruto Hiden" },
    "NEXT GENERATIONS": { season: 7, name: "Next Generations" },
    "ITACHI SHINDEN": { season: 8, name: "Itachi Shinden" },
  };

  const seasonInfo = seasonMap[setName];
  if (!seasonInfo) {
    console.warn("WARNING: Unknown set:", setName, "in", normalizedPath);
    return;
  }

  const filename = normalizedPath.split("/").pop();
  const epMatch = filename?.match(/^([A-Za-z\s]+) (\d+)([a-z]?) - (.+?) \[/);
  if (!epMatch) {
    console.warn("WARNING: Could not parse episode:", filename);
    return;
  }

  const seriesName = epMatch[1].trim();
  const episodeNum = parseInt(epMatch[2], 10);
  const episodeLetter = epMatch[3];
  const episodeTitle = epMatch[4].trim();
  const baseId = `NR${String(seasonInfo.season).padStart(2, "0")}${String(episodeNum).padStart(2, "0")}${episodeLetter || ""}`;

  episodes.push({
    id: baseId,
    season: seasonInfo.season,
    seasonName: seasonInfo.name,
    episode: episodeNum,
    title: `${seriesName} ${episodeNum}${episodeLetter || ""} - ${episodeTitle}`,
    fileIdx: idx,
    size: file.length,
    path: normalizedPath,
  });
});

// Sort episodes by season then episode number
episodes.sort((a, b) => {
  if (a.season !== b.season) return a.season - b.season;
  return a.episode - b.episode;
});

console.log("\n=== Generated", episodes.length, "episodes ===");

// Build meta data
const metaVideos = [];
let currentSeason = null;
let currentArc = null;
let currentArcVideos = [];

episodes.forEach((ep) => {
  const video = {
    id: ep.id,
    title: ep.title,
    season: ep.season,
    episode: ep.episode,
  };
  metaVideos.push(video);
});

const meta = {
  meta: {
    id: "narutorebuild",
    type: "series",
    name: "Rebuild of Naruto",
    description:
      "Rebuild of Naruto is a condensed, streamlined adaptation of the Naruto manga, cutting filler and reorganizing the story for a tighter, more impactful experience.",
    posterShape: "poster",
    logo: "https://raw.githubusercontent.com/One-Pace-Rebuild/Stremio-Sh-Arl-Op-Stremio/main/meta/series/onepace/logo.png",
    poster: "https://raw.githubusercontent.com/One-Pace-Rebuild/Stremio-Sh-Arl-Op-Stremio/main/meta/series/onepace/poster.jpg",
    backdrop: "https://raw.githubusercontent.com/One-Pace-Rebuild/Stremio-Sh-Arl-Op-Stremio/main/meta/series/onepace/backdrop.jpg",
    genre: ["Action", "Adventure", "Anime"],
    year: 2023,
    runtime: 240,
  },
  series: {
    seasons: [
      { season: 1, name: "Naruto" },
      { season: 2, name: "Naruto Gaiden" },
      { season: 3, name: "Kakashi Gaiden" },
      { season: 4, name: "Naruto Shippuden" },
      { season: 5, name: "Naruto Senjou" },
      { season: 6, name: "Naruto Hiden" },
      { season: 7, name: "Next Generations" },
      { season: 8, name: "Itachi Shinden" },
    ],
    videos: metaVideos,
  },
};

// Write meta file
const metaDir = path.join(__dirname, "..", "meta", "series");
if (!fs.existsSync(metaDir)) fs.mkdirSync(metaDir, { recursive: true });
fs.writeFileSync(
  path.join(metaDir, "narutoRebuild.json"),
  JSON.stringify(meta, null, 2)
);
console.log("Written meta/series/narutoRebuild.json");

// Write stream files
const streamDir = path.join(__dirname, "..", "stream", "series");
if (!fs.existsSync(streamDir)) fs.mkdirSync(streamDir, { recursive: true });

episodes.forEach((ep) => {
  const streamData = {
    meta: { id: "narutorebuild", type: "series" },
    streams: [
      {
        url: `magnet:?xt=urn:btih:${parsed.infoHash}&dn=Naruto+Rebuild+${ep.title.replace(/\/|\\|"/g, "+")}`,
        name: `${ep.title} [1080p]`,
        title: `${ep.title} [1080p]`,
        description: `Rebuild of Naruto - Season ${ep.season} Episode ${ep.episode}`,
        behaviorHints: {
          notWebReady: true,
          filename: ep.path.split("/").pop(),
        },
        subtitle: [
          {
            url: `https://example.com/subs/${ep.id}.vtt`,
            lang: "en",
          },
        ],
      },
    ],
  };

  fs.writeFileSync(
    path.join(streamDir, `${ep.id}.json`),
    JSON.stringify(streamData, null, 2)
  );
});

console.log(`Written ${episodes.length} stream files to stream/series/`);
console.log("Build complete!");
