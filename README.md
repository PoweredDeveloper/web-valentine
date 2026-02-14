# Valentine page

A small single-page site: “Will you be my valentine?” — one tap for yes, one for no. If they say yes, you get a Telegram message. If they say no, they get asked twice. Yes triggers confetti.

**Stack:** FastAPI, static HTML/CSS/JS, Aiogram for Telegram, optional Docker + nginx.

---

## Run it locally

```bash
# clone, then:
pip install -r requirements.txt
cp .env.example .env   # fill in your Telegram token & chat id
python -m app.main
```

Open http://localhost:8000.

---

## Run with Docker

From the project root (same folder as `docker-compose.yml` and `.env`):

```bash
docker compose up -d --build
```

Site is on port 80. Env vars are read from `.env` next to `docker-compose.yml` — the file is not copied into the image, Compose injects them at runtime.

---

## What you need in `.env`

| Variable             | What it’s for                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | From [@BotFather](https://t.me/BotFather).                                                                                  |
| `TELEGRAM_CHAT_ID`   | Your Telegram user/chat ID (e.g. [@userinfobot](https://t.me/userinfobot)). You must have started a chat with the bot once. |
| `TELEGRAM_HANDLE`    | Optional. Your username for the small link at the bottom (e.g. `InsertB` or `@InsertB`).                                    |

---

That’s it. Change the copy and styles in `app/static/` if you want your own text or look.
