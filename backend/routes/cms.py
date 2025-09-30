from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.cms import (
    Service, ServiceCreate, ServiceUpdate,
    CaseStudy, CaseStudyCreate, CaseStudyUpdate
)
from utils.auth import get_current_user
from typing import List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def create_cms_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/cms", tags=["cms"])
    
    # Services endpoints
    @router.get("/services", response_model=List[Service])
    async def get_services(active_only: bool = True):
        """Get all services"""
        try:
            filter_query = {"active": True} if active_only else {}
            cursor = db.services.find(filter_query).sort("order", 1)
            services = await cursor.to_list(length=None)
            
            # Convert ObjectId to string
            for service in services:
                service["_id"] = str(service["_id"])
                if "id" not in service:
                    service["id"] = service["_id"]
            
            return services
            
        except Exception as e:
            logger.error(f"Failed to fetch services: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch services")
    
    @router.get("/services/{service_id}", response_model=Service)
    async def get_service(service_id: str):
        """Get single service by ID"""
        try:
            service = await db.services.find_one({"id": service_id})
            if not service:
                raise HTTPException(status_code=404, detail="Service not found")
            
            service["_id"] = str(service["_id"])
            return service
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to fetch service {service_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch service")
    
    @router.post("/services", response_model=Service)
    async def create_service(
        service_data: ServiceCreate,
        current_user: dict = Depends(get_current_user)
    ):
        """Create new service (admin only)"""
        try:
            service = Service(**service_data.dict())
            result = await db.services.insert_one(service.dict())
            
            service_dict = service.dict()
            service_dict["_id"] = str(result.inserted_id)
            
            logger.info(f"Service created: {service.id}")
            return service_dict
            
        except Exception as e:
            logger.error(f"Failed to create service: {e}")
            raise HTTPException(status_code=500, detail="Failed to create service")
    
    @router.put("/services/{service_id}", response_model=Service)
    async def update_service(
        service_id: str,
        service_data: ServiceUpdate,
        current_user: dict = Depends(get_current_user)
    ):
        """Update service (admin only)"""
        try:
            # Check if service exists
            existing_service = await db.services.find_one({"id": service_id})
            if not existing_service:
                raise HTTPException(status_code=404, detail="Service not found")
            
            # Update fields
            update_data = {k: v for k, v in service_data.dict().items() if v is not None}
            update_data["updated_at"] = datetime.utcnow()
            
            await db.services.update_one(
                {"id": service_id},
                {"$set": update_data}
            )
            
            # Fetch updated service
            updated_service = await db.services.find_one({"id": service_id})
            updated_service["_id"] = str(updated_service["_id"])
            
            logger.info(f"Service updated: {service_id}")
            return updated_service
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to update service {service_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to update service")
    
    @router.delete("/services/{service_id}")
    async def delete_service(
        service_id: str,
        current_user: dict = Depends(get_current_user)
    ):
        """Delete service (admin only)"""
        try:
            result = await db.services.delete_one({"id": service_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Service not found")
            
            logger.info(f"Service deleted: {service_id}")
            return {"message": "Service deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to delete service {service_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete service")
    
    # Case Studies endpoints
    @router.get("/case-studies", response_model=List[CaseStudy])
    async def get_case_studies(active_only: bool = True, featured_only: bool = False):
        """Get all case studies"""
        try:
            filter_query = {}
            if active_only:
                filter_query["active"] = True
            if featured_only:
                filter_query["featured"] = True
                
            cursor = db.case_studies.find(filter_query).sort("order", 1)
            case_studies = await cursor.to_list(length=None)
            
            # Convert ObjectId to string
            for case_study in case_studies:
                case_study["_id"] = str(case_study["_id"])
                if "id" not in case_study:
                    case_study["id"] = case_study["_id"]
            
            return case_studies
            
        except Exception as e:
            logger.error(f"Failed to fetch case studies: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch case studies")
    
    @router.get("/case-studies/{case_study_id}", response_model=CaseStudy)
    async def get_case_study(case_study_id: str):
        """Get single case study by ID"""
        try:
            case_study = await db.case_studies.find_one({"id": case_study_id})
            if not case_study:
                raise HTTPException(status_code=404, detail="Case study not found")
            
            case_study["_id"] = str(case_study["_id"])
            return case_study
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to fetch case study {case_study_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch case study")
    
    @router.post("/case-studies", response_model=CaseStudy)
    async def create_case_study(
        case_study_data: CaseStudyCreate,
        current_user: dict = Depends(get_current_user)
    ):
        """Create new case study (admin only)"""
        try:
            case_study = CaseStudy(**case_study_data.dict())
            result = await db.case_studies.insert_one(case_study.dict())
            
            case_study_dict = case_study.dict()
            case_study_dict["_id"] = str(result.inserted_id)
            
            logger.info(f"Case study created: {case_study.id}")
            return case_study_dict
            
        except Exception as e:
            logger.error(f"Failed to create case study: {e}")
            raise HTTPException(status_code=500, detail="Failed to create case study")
    
    @router.put("/case-studies/{case_study_id}", response_model=CaseStudy)
    async def update_case_study(
        case_study_id: str,
        case_study_data: CaseStudyUpdate,
        current_user: dict = Depends(get_current_user)
    ):
        """Update case study (admin only)"""
        try:
            # Check if case study exists
            existing_case_study = await db.case_studies.find_one({"id": case_study_id})
            if not existing_case_study:
                raise HTTPException(status_code=404, detail="Case study not found")
            
            # Update fields
            update_data = {k: v for k, v in case_study_data.dict().items() if v is not None}
            update_data["updated_at"] = datetime.utcnow()
            
            await db.case_studies.update_one(
                {"id": case_study_id},
                {"$set": update_data}
            )
            
            # Fetch updated case study
            updated_case_study = await db.case_studies.find_one({"id": case_study_id})
            updated_case_study["_id"] = str(updated_case_study["_id"])
            
            logger.info(f"Case study updated: {case_study_id}")
            return updated_case_study
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to update case study {case_study_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to update case study")
    
    @router.delete("/case-studies/{case_study_id}")
    async def delete_case_study(
        case_study_id: str,
        current_user: dict = Depends(get_current_user)
    ):
        """Delete case study (admin only)"""
        try:
            result = await db.case_studies.delete_one({"id": case_study_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Case study not found")
            
            logger.info(f"Case study deleted: {case_study_id}")
            return {"message": "Case study deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to delete case study {case_study_id}: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete case study")
    
    return router