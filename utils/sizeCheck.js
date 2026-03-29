const fs = require("fs");

const MAX_SIZE_BYTES = 45 * 1024 * 1024; // 45MB — Telegram bot API limit is 50MB

function isFileTooLarge(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size > MAX_SIZE_BYTES;
  } catch {
    return false;
  }
}

function getFileSizeMB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(2);
  } catch {
    return "unknown";
  }
}

module.exports = { isFileTooLarge, getFileSizeMB };
