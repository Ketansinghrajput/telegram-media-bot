require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { isValidUrl, isSupportedUrl } = require("./utils/validator");
const { detectPlatform } = require("./handlers/detector");
const { download } = require("./handlers/downloader");
const { fetchRedditTextPost } = require("./handlers/redditText");
const { deleteFile } = require("./utils/cleanup");
const { isFileTooLarge, getFileSizeMB } = require("./utils/sizeCheck");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ALLOWED_USER_ID = process.env.ALLOWED_USER_ID;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing in .env");
if (!ALLOWED_USER_ID) throw new Error("ALLOWED_USER_ID is missing in .env");

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log("🤖 Telegram Media Bot is running...");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const text = msg.text?.trim();

  // 🔒 Private bot — only allow specific user
  if (userId !== ALLOWED_USER_ID) {
    return bot.sendMessage(chatId, "⛔ Access denied.");
  }

  // Handle /start command
  if (text === "/start") {
    return bot.sendMessage(
      chatId,
      `👋 Welcome! Send me a link from:\n\n` +
      `• 📸 Instagram (posts, reels)\n` +
      `• 🎥 YouTube (videos, shorts)\n` +
      `• 🤖 Reddit (videos, images, text posts)\n` +
      `• 🐦 Twitter/X (videos, images)\n\n` +
      `Just paste the URL and I'll handle the rest!`
    );
  }

  // Handle /help command
  if (text === "/help") {
    return bot.sendMessage(
      chatId,
      `ℹ️ *How to use:*\n\n` +
      `1. Copy a URL from Instagram, YouTube, Reddit, or Twitter/X\n` +
      `2. Paste it here\n` +
      `3. I'll download and send the media to you\n\n` +
      `⚠️ *Limitations:*\n` +
      `• Private posts cannot be downloaded\n` +
      `• Max file size: 45MB\n` +
      `• YouTube age-restricted content may fail`,
      { parse_mode: "Markdown" }
    );
  }

  // Check if message is a URL
  if (!text || !isValidUrl(text)) {
    return bot.sendMessage(chatId, "❓ Please send a valid URL.");
  }

  if (!isSupportedUrl(text)) {
    return bot.sendMessage(
      chatId,
      "❌ Unsupported URL. I support Instagram, YouTube, Reddit, and Twitter/X only."
    );
  }

  const platform = detectPlatform(text);
  const statusMsg = await bot.sendMessage(chatId, `⏳ Downloading from ${capitalize(platform)}...`);

  let filePath = null;

  try {
    // Reddit — check if it's a text post first
    if (platform === "reddit") {
      const { isTextPost, message } = await fetchRedditTextPost(text);
      if (isTextPost) {
        await bot.deleteMessage(chatId, statusMsg.message_id);
        return bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
      }
    }

    // Download media using yt-dlp
    filePath = await download(text, platform);

    // Check file size
    if (isFileTooLarge(filePath)) {
      await bot.deleteMessage(chatId, statusMsg.message_id);
      return bot.sendMessage(
        chatId,
        `❌ File is too large (${getFileSizeMB(filePath)}MB). Telegram's limit is 45MB.`
      );
    }

    await bot.deleteMessage(chatId, statusMsg.message_id);

    // Send the file
    const ext = filePath.split(".").pop().toLowerCase();
    const videoExtensions = ["mp4", "mkv", "webm", "mov"];
    const imageExtensions = ["jpg", "jpeg", "png", "webp"];

  if (videoExtensions.includes(ext)) {
  await bot.sendVideo(chatId, filePath, { caption: `✅ Downloaded from ${capitalize(platform)}` });
} else if (imageExtensions.includes(ext)) {
  await bot.sendPhoto(chatId, filePath, { caption: `✅ Downloaded from ${capitalize(platform)}` });
} else {
  await bot.sendDocument(chatId, filePath, { caption: `✅ Downloaded from ${capitalize(platform)}` });
}

  } catch (err) {
    console.error("❌ Error:", err.message);
    await bot.deleteMessage(chatId, statusMsg.message_id).catch(() => {});
    bot.sendMessage(chatId, `❌ ${err.message}`);
  } finally {
    // Always clean up temp file
    if (filePath) deleteFile(filePath);
  }
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
