"""Wedding invitation API.

Run:  uvicorn main:app --reload
Env:  ADMIN_KEY (default 'change-me'), DATABASE_URL (default sqlite:///./invite.db),
      ALLOWED_ORIGINS (comma separated, default '*')
"""
import csv
import io
import os
import re
from datetime import datetime
from typing import Optional

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import Boolean, Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_URL = os.getenv("DATABASE_URL", "sqlite:///./invite.db")
ADMIN_KEY = os.getenv("ADMIN_KEY", "change-me")
ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

engine = create_engine(DB_URL, connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {})
Session = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()


class Guest(Base):
    __tablename__ = "guests"
    id = Column(Integer, primary_key=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)


class Rsvp(Base):
    __tablename__ = "rsvps"
    id = Column(Integer, primary_key=True)
    slug = Column(String, nullable=True)
    name = Column(String, nullable=False)
    attending = Column(Boolean, nullable=False)
    guests = Column(Integer, default=1)
    message = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(engine)

app = FastAPI(title="Wedding Invitation API")
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_methods=["*"], allow_headers=["*"])


def db():
    s = Session()
    try:
        yield s
    finally:
        s.close()


def admin(x_admin_key: str = Header(default="")):
    if x_admin_key != ADMIN_KEY:
        raise HTTPException(401, "Invalid admin key")


class RsvpIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    attending: bool
    guests: int = Field(default=1, ge=1, le=10)
    message: str = Field(default="", max_length=300)
    slug: Optional[str] = None


class GuestIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "guest"


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/rsvp", status_code=201)
def create_rsvp(body: RsvpIn, s=Depends(db)):
    r = Rsvp(**body.model_dump(), )
    if not body.attending:
        r.guests = 0
    s.add(r)
    s.commit()
    return {"ok": True}


@app.get("/api/invite/{slug}")
def get_invite(slug: str, s=Depends(db)):
    g = s.query(Guest).filter_by(slug=slug).first()
    if not g:
        raise HTTPException(404, "Invite not found")
    return {"name": g.name, "slug": g.slug}


@app.post("/api/admin/guests", dependencies=[Depends(admin)])
def add_guest(body: GuestIn, s=Depends(db)):
    base, slug, n = slugify(body.name), slugify(body.name), 1
    while s.query(Guest).filter_by(slug=slug).first():
        n += 1
        slug = f"{base}-{n}"
    s.add(Guest(slug=slug, name=body.name))
    s.commit()
    return {"name": body.name, "link": f"/invite/{slug}"}


@app.get("/api/admin/rsvps", dependencies=[Depends(admin)])
def list_rsvps(s=Depends(db)):
    rows = s.query(Rsvp).order_by(Rsvp.created_at.desc()).all()
    return {
        "total_responses": len(rows),
        "attending": sum(1 for r in rows if r.attending),
        "total_guests": sum(r.guests or 0 for r in rows),
        "rsvps": [
            {"name": r.name, "attending": r.attending, "guests": r.guests, "message": r.message,
             "slug": r.slug, "created_at": r.created_at.isoformat()}
            for r in rows
        ],
    }


@app.get("/api/admin/rsvps.csv", dependencies=[Depends(admin)])
def export_csv(s=Depends(db)):
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["name", "attending", "guests", "message", "created_at"])
    for r in s.query(Rsvp).order_by(Rsvp.created_at).all():
        w.writerow([r.name, "yes" if r.attending else "no", r.guests, r.message, r.created_at.isoformat()])
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=rsvps.csv"})
