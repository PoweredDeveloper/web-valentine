import logging
import os

from aiogram import Bot
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = (os.getenv("TELEGRAM_BOT_TOKEN") or "").strip()
TELEGRAM_CHAT_ID = (os.getenv("TELEGRAM_CHAT_ID") or "").strip()

logger = logging.getLogger(__name__)
bot: Bot | None = None


async def init_bot() -> None:
    global bot
    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
        bot = Bot(token=TELEGRAM_BOT_TOKEN)
        logger.info("Telegram bot configured; notifications will be sent.")
    else:
        missing = []
        if not TELEGRAM_BOT_TOKEN:
            missing.append("TELEGRAM_BOT_TOKEN")
        if not TELEGRAM_CHAT_ID:
            missing.append("TELEGRAM_CHAT_ID")
        logger.warning("Telegram notifications disabled: missing %s", ", ".join(missing))


async def close_bot() -> None:
    global bot
    if bot:
        await bot.session.close()
        bot = None


async def send_message(text: str) -> bool:
    if not bot or not TELEGRAM_CHAT_ID:
        logger.warning("Cannot send Telegram message: bot or TELEGRAM_CHAT_ID not set.")
        return False
    try:
        await bot.send_message(chat_id=TELEGRAM_CHAT_ID, text=text)
        return True
    except Exception as e:
        logger.exception("Telegram send_message failed: %s", e)
        return False
