import os

from aiogram import Bot
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

bot: Bot | None = None


async def init_bot() -> None:
    global bot
    if TELEGRAM_BOT_TOKEN:
        bot = Bot(token=TELEGRAM_BOT_TOKEN)


async def close_bot() -> None:
    global bot
    if bot:
        await bot.session.close()
        bot = None


async def send_message(text: str) -> bool:
    if not bot or not TELEGRAM_CHAT_ID:
        return False
    try:
        await bot.send_message(chat_id=TELEGRAM_CHAT_ID, text=text)
        return True
    except Exception:
        return False
