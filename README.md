# 🤖 Telegram Media Downloader Bot

A private Telegram bot built with **Node.js** that downloads media from Instagram, YouTube, Reddit, and Twitter/X — and sends it directly to you on Telegram.

## ✨ Features

- 📸 **Instagram** — Posts, Reels
- 🎥 **YouTube** — Videos, Shorts
- 🤖 **Reddit** — Videos, Images, Text Posts
- 🐦 **Twitter/X** — Videos, Images
- 🔒 **Private bot** — Only authorized user can use it
- 🗑️ **Auto cleanup** — Temp files deleted after sending
- ⚠️ **File size guard** — Warns if file exceeds Telegram's 45MB limit

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Telegram API:** `node-telegram-bot-api`
- **Downloader:** `yt-dlp` (CLI) via `child_process`
- **Reddit text posts:** Reddit JSON API via `axios`

## 📁 Project Structure

```
telegram-media-bot/
├── index.js              # Entry point
├── handlers/
│   ├── detector.js       # Platform detection from URL
│   ├── downloader.js     # yt-dlp wrapper
│   └── redditText.js     # Reddit text post handler
├── utils/
│   ├── validator.js      # URL validation
│   ├── cleanup.js        # Temp file deletion
│   └── sizeCheck.js      # File size check
├── temp/                 # Temporary downloads (gitignored)
├── .env.example          # Environment variable template
└── package.json
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3 + `yt-dlp` installed
- `ffmpeg` installed (for YouTube video+audio merge)

### Install yt-dlp
```bash
pip install yt-dlp
```

### Install ffmpeg
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg
```

### Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/telegram-media-bot.git
cd telegram-media-bot
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
BOT_TOKEN=your_telegram_bot_token_here
ALLOWED_USER_ID=your_telegram_user_id_here
```

> Get your bot token from [@BotFather](https://t.me/BotFather)  
> Get your user ID from [@userinfobot](https://t.me/userinfobot)

### Run the Bot
```bash
npm start

# Development (auto-restart)
npm run dev
```

## 🚀 Deployment (Railway.app)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables (`BOT_TOKEN`, `ALLOWED_USER_ID`) in Railway dashboard
4. Add build command: `pip install yt-dlp && apt-get install -y ffmpeg`
5. Start command: `npm start`

## 📌 Commands

| Command | Description |
|---|---|
| `/start` | Welcome message + supported platforms |
| `/help` | Usage guide and limitations |
| `[URL]` | Paste any supported URL to download |

## ⚠️ Limitations

- Private Instagram/Twitter posts cannot be downloaded
- Max file size: **45MB** (Telegram bot API limit)
- YouTube age-restricted content may fail

## 📄 License

MIT
