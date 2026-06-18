from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT_EMAIL = os.environ.get('CONTACT_RECIPIENT_EMAIL')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Models
class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    square_meters: float = Field(..., gt=0, le=1000000)
    message: Optional[str] = Field(default="", max_length=5000)


class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    square_meters: float
    message: str = ""
    total_price: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False


PRICE_PER_SQM = 3500


def build_html_email(payload: ContactSubmission) -> str:
    total_fmt = f"{int(payload.total_price):,}".replace(",", " ")
    sqm_fmt = f"{payload.square_meters:g}"
    safe_message = (payload.message or "").replace("\n", "<br/>")
    created = payload.created_at.strftime("%Y-%m-%d %H:%M UTC")
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px;font-family:Arial,sans-serif;color:#18181b;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #d4d4d8;">
          <tr><td style="background:#18181b;padding:20px 28px;">
            <div style="color:#fafafa;font-size:12px;letter-spacing:3px;text-transform:uppercase;">BENOTEK-BAU Kft.</div>
            <div style="color:#f97316;font-size:22px;font-weight:800;margin-top:6px;">Új árajánlat-kérés</div>
          </td></tr>
          <tr><td style="padding:28px;">
            <p style="margin:0 0 18px 0;font-size:14px;color:#52525b;">Új kapcsolatfelvétel érkezett a weboldalon keresztül.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e4e4e7;">
              <tr><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;width:160px;color:#71717a;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Név</td><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;font-size:15px;font-weight:600;">{payload.name}</td></tr>
              <tr><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Telefon</td><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;font-size:15px;font-weight:600;"><a href="tel:{payload.phone}" style="color:#18181b;text-decoration:none;">{payload.phone}</a></td></tr>
              <tr><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">E-mail</td><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;font-size:15px;font-weight:600;"><a href="mailto:{payload.email}" style="color:#18181b;text-decoration:none;">{payload.email}</a></td></tr>
              <tr><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Mennyiség</td><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;font-size:15px;font-weight:600;">{sqm_fmt} m²</td></tr>
              <tr><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">Becsült ár</td><td style="padding:14px 0;border-bottom:1px solid #e4e4e7;font-size:18px;font-weight:800;color:#f97316;">{total_fmt} Ft</td></tr>
            </table>
            <div style="margin-top:24px;">
              <div style="color:#71717a;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Üzenet</div>
              <div style="background:#f4f4f5;padding:16px;border-left:3px solid #f97316;font-size:14px;line-height:1.6;">{safe_message or "<em style='color:#a1a1aa;'>Nincs üzenet megadva.</em>"}</div>
            </div>
            <p style="margin:28px 0 0 0;font-size:12px;color:#a1a1aa;">Beküldve: {created}</p>
          </td></tr>
          <tr><td style="background:#18181b;padding:14px 28px;color:#a1a1aa;font-size:11px;">BENOTEK-BAU Kft. · Gépi vakolás · Automatikus értesítés</td></tr>
        </table>
      </td></tr>
    </table>
    """


async def send_contact_email(submission: ContactSubmission) -> bool:
    if not resend.api_key or not CONTACT_RECIPIENT_EMAIL:
        logger.warning("Resend API key or recipient email not configured; skipping send")
        return False
    params = {
        "from": SENDER_EMAIL,
        "to": [CONTACT_RECIPIENT_EMAIL],
        "reply_to": submission.email,
        "subject": f"Új árajánlat-kérés – {submission.name} ({submission.square_meters:g} m²)",
        "html": build_html_email(submission),
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Resend email sent: {result}")
        return True
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")
        return False


# Routes
@api_router.get("/")
async def root():
    return {"message": "BENOTEK-BAU API", "status": "online"}


@api_router.get("/config")
async def get_config():
    return {
        "company": "BENOTEK-BAU Kft.",
        "email": "info.benotekbau@gmail.com",
        "phone": "+36 30 088 1236",
        "price_per_sqm": PRICE_PER_SQM,
        "currency": "Ft",
    }


@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact(payload: ContactSubmissionCreate):
    total = round(payload.square_meters * PRICE_PER_SQM, 2)
    submission = ContactSubmission(
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        email=str(payload.email).strip(),
        square_meters=payload.square_meters,
        message=(payload.message or "").strip(),
        total_price=total,
    )

    email_sent = await send_contact_email(submission)
    submission.email_sent = email_sent

    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_submissions.insert_one(doc)

    if not email_sent:
        # Still return the submission but signal email problem via HTTP 502
        # We persist data regardless so nothing is lost
        raise HTTPException(
            status_code=502,
            detail="A beküldés mentve, de az e-mail küldés sikertelen volt. Kérjük, próbálja újra később vagy hívjon minket telefonon."
        )

    return submission


@api_router.get("/contact/submissions", response_model=List[ContactSubmission])
async def list_submissions(limit: int = 100):
    docs = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
