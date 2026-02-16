![Web page preview](/imgs/preview.png)

# 💕 Web Valentine

A single-page “Will you be my valentine?” site. One tap for yes, one for no. **Yes** sends you a Telegram notification and triggers confetti; **No** asks for confirmation twice. Built for a bit of fun, not for production hardening.

**Stack:** FastAPI, static HTML/CSS/JS, Aiogram (Telegram), optional Docker + nginx. **Requires Python 3.12+.**

---

## 🚀 Run locally

**Requirements:** Python 3.12+ (check with `python3 --version`).

In a terminal, from the project root:

```bash
# Create a virtual environment and install dependencies
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# (Optional) Telegram notifications — copy and add your token/chat ID to .env
cp .env.example .env

# Start the server
.venv/bin/python -m app.main
```

**Windows (PowerShell):** use `.venv\Scripts\pip` and `.venv\Scripts\python` instead of `.venv/bin/...`.

Open **http://localhost:8000**. The page works without `.env`; Telegram is only needed for “Yes” notifications.

---

## 🐳 Run with Docker

From the project root (same folder as `docker-compose.yml` and `.env`):

```bash
docker compose up -d --build
```

The app is served on **port 80** via nginx: static HTML/CSS/JS are served by nginx; only `/api/*` is proxied to the FastAPI app. Env vars are loaded from `.env` next to `docker-compose.yml`; the file is not baked into the image.

Optional: for HTTPS, put certs in `/opt/ssl` and adjust `nginx/nginx.conf` as needed.

---

## ⚙️ Environment (`.env`)

| Variable             | Description                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | Bot token from [@BotFather](https://t.me/BotFather).                                                                                      |
| `TELEGRAM_CHAT_ID`   | Your Telegram user/chat ID (e.g. from [@userinfobot](https://t.me/userinfobot)). You must have started a chat with the bot at least once. |
| `TELEGRAM_HANDLE`    | Optional. Your Telegram username shown as a link at the bottom (e.g. `johndoe` or `@johndoe`).                                            |

---

## 📁 Project layout

```
├── app/
│   ├── main.py      # run entrypoint (uvicorn with reload)
│   ├── web.py       # FastAPI app, static mount, API routes
│   ├── telegram_bot.py
│   └── static/      # index.html, style.css, main.js, assets
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env             # not in repo; copy from .env.example
```

Copy and styles live in `app/static/`. Edit those to change the text or look.
