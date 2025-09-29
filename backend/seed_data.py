"""Seed data for Alaama Creative Studio CMS"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from models.cms import Service, CaseStudy, AdminUser
from utils.auth import get_password_hash
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/alaama')
DB_NAME = os.environ.get('DB_NAME', 'alaama_cms')

# Seed Services Data
services_data = [
    {
        "title": "Brand Strategy & Identity",
        "subtitle": "Positioning, Naming, Guidelines",
        "description": "We craft complete brand identities that spark connection, build trust, and stand out in a crowded world. From strategy to design, we tell your story with impact.",
        "icon": "Palette",
        "outcomes": [
            "Clear brand positioning and messaging",
            "Complete visual identity system", 
            "Brand guidelines and standards"
        ],
        "order": 1,
        "active": True
    },
    {
        "title": "Digital Experience",
        "subtitle": "Web & Mobile Development",
        "description": "We turn ideas into intuitive, high-performance digital products. Whether it's a stunning website or a powerful mobile app, our team designs seamless experiences that are built to scale.",
        "icon": "Monitor",
        "outcomes": [
            "Site UX/CX optimization",
            "Conversion-focused copy",
            "Local SEO implementation"
        ],
        "order": 2,
        "active": True
    },
    {
        "title": "Content Systems", 
        "subtitle": "Media Management",
        "description": "We don't just manage content — we create moments that matter. From social media to digital campaigns, we grow your audience with consistent, creative, and data-driven storytelling.",
        "icon": "Camera",
        "outcomes": [
            "Photo direction and style guides",
            "Reels and template creation",
            "Launch calendar systems"
        ],
        "order": 3,
        "active": True
    },
    {
        "title": "Go-to-Market & Growth",
        "subtitle": "With TBU Partnership", 
        "description": "Business goals first in partnership with TBU. Design decisions that pay back with clear offers, pricing models, and KPI tracking.",
        "icon": "TrendingUp",
        "outcomes": [
            "Market entry strategies",
            "Pricing and offer optimization",
            "Performance tracking dashboards"
        ],
        "order": 4,
        "active": True
    },
    {
        "title": "Training & Handover",
        "subtitle": "Brand Books, SOPs, Templates",
        "description": "Complete knowledge transfer with comprehensive brand books, standard operating procedures, and ready-to-use templates for your team.",
        "icon": "BookOpen",
        "outcomes": [
            "Comprehensive brand documentation",
            "Team training materials", 
            "Operational templates"
        ],
        "order": 5,
        "active": True
    }
]

# Seed Case Studies Data
case_studies_data = [
    {
        "title": "Vibes Burger",
        "category": "Brand Development",
        "subtitle": "Everyday crave burgers with clear choice architecture",
        "challenge": "Clarify a fast-growing burger concept's offer and story across channels so guests choose faster and the brand travels beyond a single city.",
        "position": "Everyday crave burgers with clear choice architecture, a straight-talk menu and visual system built for multi-market use (menu, web, delivery, franchise interest).",
        "identity": [
            "Clean, modular menu language (beef, chicken, veg lines + signature sauces) with plain-language descriptors",
            "Photography in natural light highlighting patties, sauces, and crunch elements; minimal props for speed and consistency",
            "Tone of voice: direct, appetite-led, family-friendly; franchise-ready naming conventions"
        ],
        "execution": [
            "Menu system and category structure aligned to web and in-store boards",
            "Website content & IA: clear hero CTAs to 'Discover Menu,' contact and locations, and franchise interest pathway",
            "Starter brand kit: photo direction, caption style, and delivery-platform copy for consistency across listings"
        ],
        "impact": [
            "Faster ordering and fewer clarifying questions at the counter (menu comprehension observed)",
            "Higher click-through to 'Discover Menu' and franchise enquiries captured via site pathways",
            "Delivery listing coherence across platforms supporting ratings and reviews over time"
        ],
        "image": "/api/placeholder/600/400",
        "featured": True,
        "order": 1,
        "active": True
    },
    {
        "title": "Gulf Franchise Hub",
        "category": "Corporate Rebranding", 
        "subtitle": "Corporate-level branding and social presence from scratch",
        "challenge": "Build Gulf Franchise Hub from the ground up with corporate-level branding, messaging, and social channels.",
        "position": "Hand-on expansion business expansion in partnership with comprehensive market entry support.",
        "identity": [
            "Corporate-level visual identity system",
            "Professional messaging framework", 
            "Consistent voice across all touchpoints"
        ],
        "execution": [
            "Complete brand identity development",
            "Social media channel setup and strategy",
            "Corporate communication guidelines"
        ],
        "impact": [
            "Credible consultancy presence established",
            "Consistent brand voice across platforms",
            "Professional market positioning achieved"
        ],
        "image": "/api/placeholder/600/400",
        "featured": True,
        "order": 2,
        "active": True
    }
]

async def seed_database():
    """Seed the database with initial data"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        print("🌱 Seeding Alaama Creative Studio database...")
        
        # Clear existing data
        print("🗑️  Clearing existing data...")
        await db.services.delete_many({})
        await db.case_studies.delete_many({})
        await db.admin_users.delete_many({})
        
        # Seed Services
        print("📋 Seeding services...")
        services = [Service(**service_data) for service_data in services_data]
        service_dicts = [service.dict() for service in services]
        await db.services.insert_many(service_dicts)
        print(f"✅ Inserted {len(services)} services")
        
        # Seed Case Studies
        print("📚 Seeding case studies...")
        case_studies = [CaseStudy(**case_study_data) for case_study_data in case_studies_data]
        case_study_dicts = [case_study.dict() for case_study in case_studies]
        await db.case_studies.insert_many(case_study_dicts)
        print(f"✅ Inserted {len(case_studies)} case studies")
        
        # Create default admin user
        print("👤 Creating default admin user...")
        admin_user = AdminUser(
            username="admin",
            email="admin@alaama.co",
            role="admin"
        )
        
        admin_dict = admin_user.dict()
        admin_dict["password_hash"] = get_password_hash("admin123")  # Change this in production!
        
        await db.admin_users.insert_one(admin_dict)
        print("✅ Created default admin user (username: admin, password: admin123)")
        
        print("\n🎉 Database seeded successfully!")
        print("\n📝 Next steps:")
        print("1. Change the default admin password")
        print("2. Configure SMTP settings in .env for email notifications")
        print("3. Set up GA_MEASUREMENT_ID and CALENDLY_LINK in .env")
        print("4. Test the contact form and CMS functionality")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())