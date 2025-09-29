from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=100)
    message: str = Field(..., min_length=10, max_length=2000)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    email_sent: bool = False
    email_sent_at: Optional[datetime] = None
    honeypot: Optional[str] = None  # Spam protection

class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr  
    company: Optional[str] = Field(None, max_length=100)
    message: str = Field(..., min_length=10, max_length=2000)
    honeypot: Optional[str] = None  # Hidden field for spam protection

class ContactSubmissionResponse(BaseModel):
    success: bool
    message: str
    id: Optional[str] = None