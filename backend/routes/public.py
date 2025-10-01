from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.cms import Service, CaseStudy, Concept
from typing import List
import logging

logger = logging.getLogger(__name__)

def create_public_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/public", tags=["public"])
    
    @router.get("/services", response_model=List[Service])
    async def get_public_services():
        """Get active services for public website"""
        try:
            cursor = db.services.find({"active": True}).sort("order", 1)
            services = await cursor.to_list(length=None)
            
            # Convert ObjectId to string and ensure id field
            for service in services:
                service["_id"] = str(service["_id"])
                if "id" not in service:
                    service["id"] = service["_id"]
            
            return services
            
        except Exception as e:
            logger.error(f"Failed to fetch public services: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch services")
    
    @router.get("/case-studies", response_model=List[CaseStudy])
    async def get_public_case_studies(featured_only: bool = False):
        """Get active case studies for public website"""
        try:
            filter_query = {"active": True}
            if featured_only:
                filter_query["featured"] = True
                
            cursor = db.case_studies.find(filter_query).sort("order", 1)
            case_studies = await cursor.to_list(length=None)
            
            # Convert ObjectId to string and ensure id field
            for case_study in case_studies:
                case_study["_id"] = str(case_study["_id"])
                if "id" not in case_study:
                    case_study["id"] = case_study["_id"]
            
            return case_studies
            
        except Exception as e:
            logger.error(f"Failed to fetch public case studies: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch case studies")
    
    @router.get("/config")
    async def get_public_config():
        """Get public configuration (GA, Calendly, etc.)"""
        import os
        
        return {
            "ga_measurement_id": os.environ.get("GA_MEASUREMENT_ID"),
            "calendly_link": os.environ.get("CALENDLY_LINK"),
            "contact_email": "info@alaama.co",
            "instagram": "@alaama.bh",
            "website": "www.alaama.co"
        }
    
    return router