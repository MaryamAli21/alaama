from fastapi import APIRouter, HTTPException, Request, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.contact import ContactSubmissionCreate, ContactSubmissionResponse, ContactSubmission
from utils.email import send_contact_notification, send_welcome_email
from datetime import datetime
import logging
import asyncio
from typing import Dict
import time

logger = logging.getLogger(__name__)

# Rate limiting storage (in production, use Redis)
rate_limit_storage: Dict[str, Dict[str, int]] = {}

def check_rate_limit(ip: str, limit: int = 5, window: int = 300) -> bool:
    """Simple rate limiting: 5 requests per 5 minutes per IP"""
    current_time = int(time.time())
    window_start = current_time - window
    
    if ip not in rate_limit_storage:
        rate_limit_storage[ip] = {}
    
    # Clean old entries
    rate_limit_storage[ip] = {
        timestamp: count for timestamp, count in rate_limit_storage[ip].items() 
        if int(timestamp) > window_start
    }
    
    # Count requests in current window
    total_requests = sum(rate_limit_storage[ip].values())
    
    if total_requests >= limit:
        return False
    
    # Add current request
    current_minute = str(current_time // 60)
    rate_limit_storage[ip][current_minute] = rate_limit_storage[ip].get(current_minute, 0) + 1
    
    return True

def create_contact_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/contact", tags=["contact"])
    
    @router.post("/", response_model=ContactSubmissionResponse)
    async def submit_contact_form(
        contact_data: ContactSubmissionCreate,
        request: Request
    ):
        """Submit contact form with spam protection and email notification"""
        
        try:
            # Get client IP for rate limiting
            client_ip = request.client.host
            
            # Check rate limiting
            if not check_rate_limit(client_ip):
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please try again later."
                )
            
            # Honeypot spam protection
            if contact_data.honeypot:
                logger.warning(f"Spam attempt detected from {client_ip}")
                # Return success to avoid revealing spam detection
                return ContactSubmissionResponse(
                    success=True,
                    message="Thank you for your message. We'll get back to you soon!",
                    id=None
                )
            
            # Create contact submission
            submission = ContactSubmission(
                **contact_data.dict(exclude={"honeypot"}),
                ip_address=client_ip,
                user_agent=request.headers.get("user-agent"),
                submitted_at=datetime.utcnow()
            )
            
            # Save to database
            result = await db.contact_submissions.insert_one(submission.dict())
            submission_id = str(result.inserted_id)
            
            # Send email notifications asynchronously
            async def send_emails():
                try:
                    # Send notification to admin
                    admin_email_sent = send_contact_notification(
                        contact_name=submission.name,
                        contact_email=submission.email,
                        contact_company=submission.company,
                        contact_message=submission.message,
                        contact_id=submission.id
                    )
                    
                    # Send welcome email to user
                    welcome_email_sent = send_welcome_email(
                        contact_email=submission.email,
                        contact_name=submission.name
                    )
                    
                    # Update submission with email status
                    await db.contact_submissions.update_one(
                        {"_id": result.inserted_id},
                        {
                            "$set": {
                                "email_sent": admin_email_sent,
                                "email_sent_at": datetime.utcnow() if admin_email_sent else None
                            }
                        }
                    )
                    
                    logger.info(f"Emails sent for submission {submission.id}: admin={admin_email_sent}, welcome={welcome_email_sent}")
                    
                except Exception as e:
                    logger.error(f"Failed to send emails for submission {submission.id}: {e}")
            
            # Send emails in background
            asyncio.create_task(send_emails())
            
            return ContactSubmissionResponse(
                success=True,
                message="Thank you for your message. We'll get back to you within 24 hours!",
                id=submission.id
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Contact form submission failed: {e}")
            raise HTTPException(
                status_code=500,
                detail="An error occurred while processing your request. Please try again or contact us directly at info@alaama.co"
            )
    
    @router.get("/submissions")
    async def get_contact_submissions(
        skip: int = 0,
        limit: int = 50,
        current_user: dict = Depends(lambda: {"username": "admin"})  # Placeholder for auth
    ):
        """Get contact submissions (admin only)"""
        try:
            cursor = db.contact_submissions.find().sort("submitted_at", -1).skip(skip).limit(limit)
            submissions = await cursor.to_list(length=limit)
            
            # Convert ObjectId to string for JSON serialization
            for submission in submissions:
                submission["_id"] = str(submission["_id"])
            
            total_count = await db.contact_submissions.count_documents({})
            
            return {
                "submissions": submissions,
                "total": total_count,
                "skip": skip,
                "limit": limit
            }
            
        except Exception as e:
            logger.error(f"Failed to fetch contact submissions: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch submissions")
    
    return router