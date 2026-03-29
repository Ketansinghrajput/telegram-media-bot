function detectPlatform(url) {
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/reddit\.com/i.test(url)) return "reddit";
  if (/twitter\.com|x\.com/i.test(url)) return "twitter";
  return "unknown";
}

module.exports = { detectPlatform };
