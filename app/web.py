import asyncio
import logging
import os
import time
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import telegram_bot

logging.getLogger("app").setLevel(logging.INFO)
static_dir = Path(__file__).resolve().parent / "static"

# Rate limit: one submission per IP per 60 seconds
RATE_LIMIT_SECONDS = 60
_submissions: dict[str, float] = {}


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@asynccontextmanager
async def lifespan(app: FastAPI):
    await telegram_bot.init_bot()
    yield
    await telegram_bot.close_bot()


app = FastAPI(lifespan=lifespan)


class ValentineResponse(BaseModel):
    agreed: bool


@app.get("/api/config")
async def get_config():
    handle = (os.getenv("TELEGRAM_HANDLE") or "").strip().lstrip("@")
    return {"telegramHandle": handle or None}


@app.post("/api/send-response")
async def send_response(request: Request, body: ValentineResponse):
    ip = _get_client_ip(request)
    now = time.monotonic()
    if ip in _submissions and (now - _submissions[ip]) < RATE_LIMIT_SECONDS:
        return JSONResponse(
            {"success": False, "detail": "Please wait before submitting again."},
            status_code=429,
        )
    _submissions[ip] = now

    text = "💕 Valentine said YES to being your valentine!" if body.agreed else "😢 Valentine said no to being your valentine."
    asyncio.create_task(telegram_bot.send_message(text))
    return JSONResponse({"success": True})


app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")
