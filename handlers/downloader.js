const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const TEMP_DIR = path.join(__dirname, "../temp");

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function buildOutputPath(platform) {
  const timestamp = Date.now();
  return {
    template: path.join(TEMP_DIR, `${platform}_${timestamp}.%(ext)s`),
    prefix: `${platform}_${timestamp}`
  };
}

function resolveActualFile(prefix) {
  const files = fs.readdirSync(TEMP_DIR).filter((f) => f.startsWith(prefix));
  console.log(`🔍 Looking for prefix: ${prefix}`);
  console.log(`📁 Found:`, files);
  if (files.length === 0) throw new Error("Downloaded file not found");
  return path.join(TEMP_DIR, files[0]);
}

function download(url, platform) {
  return new Promise((resolve, reject) => {
    const { template, prefix } = buildOutputPath(platform); // 👈 changed

  const isInstagram = platform === "instagram";

const cmd = [
  "yt-dlp",
  `--output "${template}"`,
  "--no-playlist",
  "--socket-timeout 30",
  "--max-filesize 45m",
   "--write-thumbnail",
   isInstagram ? `--username ${process.env.INSTA_USER} --password ${process.env.INSTA_PASS}` : "--merge-output-format mp4",
  `"${url}"`,
].filter(Boolean).join(" ");
    console.log(`⬇️ Downloading [${platform}]: ${url}`);

    exec(cmd, { timeout: 120000 }, (err, stdout, stderr) => {
        console.log("STDOUT:", stdout);  
  console.log("STDERR:", stderr);  
      if (err) {
        console.error("yt-dlp error:", stderr);
        return reject(new Error(parseYtDlpError(stderr)));
      }

      try {
        const filePath = resolveActualFile(prefix); // 👈 prefix use karo
        resolve(filePath);
      } catch (resolveErr) {
        reject(resolveErr);
      }
    });
  });
}

function parseYtDlpError(stderr) {
  if (!stderr) return "Download failed. Try again.";
  if (stderr.includes("Private")) return "This post is private. Cannot download.";
  if (stderr.includes("File is larger")) return "File is too large (>45MB). Cannot send via Telegram.";
  if (stderr.includes("Unsupported URL")) return "This URL is not supported by the downloader.";
  if (stderr.includes("HTTP Error 404")) return "Content not found. It may have been deleted.";
  return "Download failed. The content might be private or unavailable.";
}

module.exports = { download };
