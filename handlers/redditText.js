const axios = require("axios");

async function fetchRedditTextPost(url) {
  try {
    const jsonUrl = url.replace(/\/?$/, ".json");

    const response = await axios.get(jsonUrl, {
      headers: {
        "User-Agent": "TelegramMediaBot/1.0",
      },
      timeout: 10000,
    });

    const post = response.data[0]?.data?.children[0]?.data;
    if (!post) throw new Error("Could not parse Reddit post.");

    const title = post.title || "No title";
    const body = post.selftext || "";
    const subreddit = post.subreddit_name_prefixed || "";
    const author = post.author || "unknown";
    const score = post.score || 0;

    let message = `📌 *${escapeMarkdown(title)}*\n\n`;
    message += `👤 u/${author} | ${subreddit} | ⬆️ ${score}\n\n`;
    if (body) {
      const truncated = body.length > 3000 ? body.substring(0, 3000) + "..." : body;
      message += escapeMarkdown(truncated);
    } else {
      message += "_[No text body — might be a link or media post]_";
    }

    return { isTextPost: !post.is_video && !post.url?.match(/\.(jpg|jpeg|png|gif|mp4)/i), message };
  } catch (err) {
    throw new Error("Failed to fetch Reddit post: " + err.message);
  }
}

function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

module.exports = { fetchRedditTextPost };
