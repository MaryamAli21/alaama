# Alaama Creative Studio - API Contracts & Integration Plan

## Overview
This document defines the API contracts and integration plan between the React frontend and FastAPI backend for the Alaama Creative Studio website.

## Current Mock Data Location
All mock data is currently stored in `/app/frontend/src/data/mock.js`

## Backend Implementation Required

### 1. Contact Form API
**Endpoint:** `POST /api/contact`
**Purpose:** Handle contact form submissions with spam protection and email notifications

```json
Request Body:
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "company": "string (optional)",
  "message": "string (required)"
}

Response:
{
  "success": boolean,
  "message": "string",
  "id": "string (contact submission ID)"
}
```

**Features to implement:**
- Save contact submission to MongoDB
- Send email notification to alaamacreative@gmail.com
- Basic spam protection (rate limiting, captcha consideration)
- Input validation and sanitization
- Email template with professional formatting

### 2. Services Management API (CMS)
**Endpoints:**
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service (admin)
- `PUT /api/services/{id}` - Update service (admin)
- `DELETE /api/services/{id}` - Delete service (admin)

```json
Service Schema:
{
  "id": "string",
  "title": "string",
  "subtitle": "string", 
  "description": "string",
  "icon": "string (Lucide icon name)",
  "outcomes": ["string array"],
  "order": "number",
  "active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### 3. Case Studies Management API (CMS)
**Endpoints:**
- `GET /api/case-studies` - Get all case studies
- `GET /api/case-studies/{id}` - Get single case study
- `POST /api/case-studies` - Create case study (admin)
- `PUT /api/case-studies/{id}` - Update case study (admin)
- `DELETE /api/case-studies/{id}` - Delete case study (admin)

```json
Case Study Schema:
{
  "id": "string",
  "title": "string",
  "category": "string",
  "subtitle": "string",
  "challenge": "string",
  "position": "string", 
  "identity": ["string array"],
  "execution": ["string array"],
  "impact": ["string array"],
  "image": "string (URL)",
  "featured": "boolean",
  "order": "number",
  "active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### 4. Admin Authentication API
**Endpoints:**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin user

### 5. Analytics Integration
**Requirements:**
- Google Analytics 4 integration
- Environment variable: `GA_MEASUREMENT_ID`
- Cookie consent banner
- Privacy policy page

### 6. Third-party Integrations

#### Email Service (for contact form)
**Requirements:**
- SMTP configuration or service like SendGrid
- Email templates
- Environment variables for email credentials

#### Calendly Integration
**Requirements:**
- Environment variable: `CALENDLY_LINK`
- Configurable placeholder until link is ready

## Database Models (MongoDB)

### Contact Submissions Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string", 
  "company": "string",
  "message": "string",
  "ip_address": "string",
  "user_agent": "string",
  "submitted_at": "datetime",
  "email_sent": "boolean",
  "email_sent_at": "datetime"
}
```

### Services Collection
```json
{
  "_id": "ObjectId",
  "title": "string",
  "subtitle": "string",
  "description": "string", 
  "icon": "string",
  "outcomes": ["string"],
  "order": "number",
  "active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Case Studies Collection  
```json
{
  "_id": "ObjectId",
  "title": "string",
  "category": "string",
  "subtitle": "string",
  "challenge": "string",
  "position": "string",
  "identity": ["string"],
  "execution": ["string"], 
  "impact": ["string"],
  "image": "string",
  "featured": "boolean",
  "order": "number", 
  "active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Admin Users Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password_hash": "string",
  "role": "string (admin)",
  "created_at": "datetime",
  "last_login": "datetime"
}
```

## Environment Variables Required

### Backend (.env)
```
MONGO_URL=existing
DB_NAME=existing
SECRET_KEY=jwt_secret_key
SMTP_HOST=smtp_server
SMTP_PORT=587
SMTP_USER=email_username
SMTP_PASSWORD=email_password
NOTIFICATION_EMAIL=alaamacreative@gmail.com
GA_MEASUREMENT_ID=google_analytics_id
CALENDLY_LINK=calendly_booking_url
CORS_ORIGINS=frontend_url
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=existing
REACT_APP_GA_MEASUREMENT_ID=google_analytics_id
```

## Frontend Integration Changes

### Remove Mock Data
1. Replace mock data imports in components with API calls
2. Add loading states for API requests  
3. Add error handling for failed requests
4. Implement proper state management (React Context or Redux)

### Components to Update
1. **Services.jsx** - Fetch services from API
2. **Work.jsx** - Fetch case studies from API  
3. **Contact.jsx** - Submit form to API
4. **App.js** - Add Google Analytics

### New Components Needed
1. **AdminLogin.jsx** - Admin authentication
2. **AdminDashboard.jsx** - CMS interface
3. **ServiceForm.jsx** - Service management form
4. **CaseStudyForm.jsx** - Case study management form
5. **LoadingSpinner.jsx** - Loading component
6. **ErrorBoundary.jsx** - Error handling

## Testing Requirements
1. Contact form submission and email delivery
2. Admin authentication flow
3. CRUD operations for services and case studies
4. Mobile responsiveness
5. Performance (Lighthouse score 90+)
6. SEO metadata and Open Graph tags

## Deployment Considerations
1. Environment variable configuration
2. Email service setup (SMTP/SendGrid)
3. Google Analytics configuration
4. Calendly integration setup
5. SSL certificates for production
6. Database backup strategy

## Migration Steps
1. Implement backend APIs with test data
2. Create admin user and authentication
3. Migrate mock data to database
4. Update frontend to use APIs
5. Implement admin CMS interface
6. Set up email service integration
7. Configure Google Analytics
8. Testing and deployment