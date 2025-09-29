from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Service Models
class ServiceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    subtitle: str = Field(..., min_length=1, max_length=300)
    description: str = Field(..., min_length=1, max_length=1000)
    icon: str = Field(..., min_length=1, max_length=50)  # Lucide icon name
    outcomes: List[str] = Field(..., min_items=1, max_items=10)
    order: int = Field(default=0)
    active: bool = Field(default=True)

class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    subtitle: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = Field(None, min_length=1, max_length=1000)
    icon: Optional[str] = Field(None, min_length=1, max_length=50)
    outcomes: Optional[List[str]] = Field(None, min_items=1, max_items=10)
    order: Optional[int] = None
    active: Optional[bool] = None

class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str
    description: str
    icon: str
    outcomes: List[str]
    order: int
    active: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Case Study Models
class CaseStudyCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1, max_length=100)
    subtitle: str = Field(..., min_length=1, max_length=300)
    challenge: str = Field(..., min_length=1, max_length=2000)
    position: str = Field(..., min_length=1, max_length=2000)
    identity: List[str] = Field(..., min_items=1, max_items=10)
    execution: List[str] = Field(..., min_items=1, max_items=10)
    impact: List[str] = Field(..., min_items=1, max_items=10)
    image: Optional[str] = Field(None, max_length=500)  # Image URL
    featured: bool = Field(default=False)
    order: int = Field(default=0)
    active: bool = Field(default=True)

class CaseStudyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    subtitle: Optional[str] = Field(None, min_length=1, max_length=300)
    challenge: Optional[str] = Field(None, min_length=1, max_length=2000)
    position: Optional[str] = Field(None, min_length=1, max_length=2000)
    identity: Optional[List[str]] = Field(None, min_items=1, max_items=10)
    execution: Optional[List[str]] = Field(None, min_items=1, max_items=10)
    impact: Optional[List[str]] = Field(None, min_items=1, max_items=10)
    image: Optional[str] = Field(None, max_length=500)
    featured: Optional[bool] = None
    order: Optional[int] = None
    active: Optional[bool] = None

class CaseStudy(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    subtitle: str
    challenge: str
    position: str
    identity: List[str]
    execution: List[str] 
    impact: List[str]
    image: Optional[str]
    featured: bool
    order: int
    active: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Admin User Models
class AdminUserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    role: str = Field(default="admin")

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    role: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None