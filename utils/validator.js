const SUPPORTED_PATTERNS = [
  /instagram\.com\/(p|reel|tv)\//i,
  /youtube\.com\/watch\?v=/i,
  /youtu\.be\//i,
  /youtube\.com\/shorts\//i,
  /reddit\.com\/r\/.+\/comments\//i,
  /twitter\.com\/.+\/status\//i,
  /x\.com\/.+\/status\//i,
];

function isValidUrl(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

function isSupportedUrl(url) {
  return SUPPORTED_PATTERNS.some((pattern) => pattern.test(url));
}

module.exports = { isValidUrl, isSupportedUrl };
