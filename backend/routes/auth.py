from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta, datetime
from models.cms import AdminLogin, Token, AdminUser, AdminUserCreate
from utils.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
import logging

logger = logging.getLogger(__name__)

def create_auth_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/auth", tags=["authentication"])
    
    @router.post("/register")
    async def register_admin(admin_data: AdminUserCreate):
        """Register new admin user (for initial setup)"""
        try:
            # Check if user already exists
            existing_user = await db.admin_users.find_one({
                "$or": [
                    {"username": admin_data.username},
                    {"email": admin_data.email}
                ]
            })
            
            if existing_user:
                raise HTTPException(
                    status_code=400,
                    detail="Username or email already registered"
                )
            
            # Create admin user
            hashed_password = get_password_hash(admin_data.password)
            admin_user = AdminUser(
                username=admin_data.username,
                email=admin_data.email,
                role=admin_data.role
            )
            
            # Save to database
            user_dict = admin_user.dict()
            user_dict["password_hash"] = hashed_password
            
            result = await db.admin_users.insert_one(user_dict)
            user_dict["_id"] = str(result.inserted_id)
            
            logger.info(f"Admin user created: {admin_user.username}")
            
            # Remove password from response
            user_dict.pop("password_hash", None)
            return {"message": "Admin user created successfully", "user": user_dict}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to register admin: {e}")
            raise HTTPException(status_code=500, detail="Registration failed")
    
    @router.post("/login", response_model=Token)
    async def login(form_data: OAuth2PasswordRequestForm = Depends()):
        """Admin login"""
        try:
            # Find user
            user = await db.admin_users.find_one({"username": form_data.username})
            
            if not user or not verify_password(form_data.password, user.get("password_hash", "")):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Update last login
            await db.admin_users.update_one(
                {"_id": user["_id"]},
                {"$set": {"last_login": datetime.utcnow()}}
            )
            
            # Create access token
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user["username"]},
                expires_delta=access_token_expires
            )
            
            logger.info(f"User logged in: {user['username']}")
            
            return {
                "access_token": access_token,
                "token_type": "bearer"
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Login failed: {e}")
            raise HTTPException(status_code=500, detail="Login failed")
    
    @router.get("/me")
    async def get_current_user_info(current_user: dict = Depends(get_current_user)):
        """Get current user information"""
        try:
            user = await db.admin_users.find_one({"username": current_user["username"]})
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Remove sensitive information
            user.pop("password_hash", None)
            user["_id"] = str(user["_id"])
            
            return user
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to fetch user info: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch user info")
    
    @router.post("/logout")
    async def logout(current_user: dict = Depends(get_current_user)):
        """Logout (client should discard token)"""
        return {"message": "Successfully logged out"}
    
    return router