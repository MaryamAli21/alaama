# Alaama Creative Studio Website

A production-ready website for Alaama Creative Studio built with React, FastAPI, and MongoDB. Features ultra-subtle Locomotive Scroll animations, comprehensive CMS, contact form with email notifications, and Google Analytics integration.

## 🚀 Features

### Frontend
- **Ultra-Low Locomotive Scroll**: Subtle parallax effects with speeds 0.05-0.2
- **Pixel Pushers Design System**: Black backgrounds with lime green accents
- **Responsive Design**: Mobile-first approach with accessibility features
- **Real-time API Integration**: Dynamic content from backend CMS
- **Google Analytics 4**: Privacy-compliant tracking with cookie consent
- **i18n Ready**: Structured for multilingual support (English implemented)

### Backend
- **FastAPI Framework**: High-performance async API
- **MongoDB Integration**: Flexible document storage
- **Contact Form API**: Spam protection + email notifications
- **Admin CMS**: Full CRUD for services and case studies
- **JWT Authentication**: Secure admin access
- **Email Service**: SMTP integration for notifications

### Performance & Accessibility
- **Lighthouse Score**: Mobile ≥ 90
- **Accessibility**: WCAG AA compliant
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Mobile Optimized**: Native scroll on devices < 768px
- **SSR Safe**: Client-only scroll initialization

## 📋 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB
- SMTP server (for email notifications)

### Environment Setup

1. **Backend Configuration** (`.env` in `/backend/`)
```env
# Database
MONGO_URL=mongodb://localhost:27017/alaama
DB_NAME=alaama_cms

# Authentication  
SECRET_KEY=your_jwt_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
NOTIFICATION_EMAIL=alaamacreative@gmail.com

# Analytics & Integrations
GA_MEASUREMENT_ID=G-XXXXXXXXXX
CALENDLY_LINK=https://calendly.com/your-link

# CORS
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

2. **Frontend Configuration** (`.env` in `/frontend/`)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Installation & Development

```bash
# Backend setup
cd backend
pip install -r requirements.txt
python seed_data.py  # Initialize database with sample data
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend setup  
cd frontend
yarn install
yarn start
```

### Production Deployment

```bash
# Backend
cd backend
pip install -r requirements.txt
python seed_data.py
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend
cd frontend
yarn install
yarn build
# Serve build/ with your preferred static server
```

## 🎛️ CMS Admin Panel

Access the admin panel at `/admin` with default credentials:
- **Username**: `admin`
- **Password**: `admin123` (⚠️ Change in production!)

### Admin Features
- **Services Management**: Add, edit, delete, and reorder services
- **Case Studies**: Manage portfolio items with rich content
- **Contact Submissions**: View and manage form submissions
- **Content Toggle**: Enable/disable items without deletion

## 🎨 Locomotive Scroll Configuration

### Current Implementation (25 scroll elements)

**Hero Section Elements:**
- Background: `0.1` vertical parallax
- Headline: `0.05` gentle reveal  
- Tagline: `0.12` horizontal drift
- CTAs: `0.08` and `0.15` staggered reveals
- Decorative elements: `-0.05` to `-0.08` counter-motion

**Services Section:**
- Cards alternate: `0.15` horizontal + `0.12` vertical
- Section divider: `-0.05` counter-motion

**Work Section:**
- Case studies: `0.1` and `0.2` mixed directions
- Gallery: `0.07-0.17` varied speeds

### Customization
```jsx
// Standard reveal
<div data-scroll data-scroll-speed="0.1">Content</div>

// Horizontal drift  
<div data-scroll data-scroll-direction="horizontal" data-scroll-speed="0.15">Content</div>

// Counter-motion decorative
<div data-scroll data-scroll-speed="-0.05" aria-hidden="true">Decoration</div>
```

See `/frontend/LOCOMOTIVE_SCROLL_GUIDE.md` for complete documentation.

## 📊 API Endpoints

### Public APIs
- `GET /api/public/services` - Active services
- `GET /api/public/case-studies` - Active case studies  
- `GET /api/public/config` - Site configuration
- `POST /api/contact/` - Submit contact form

### Admin APIs (Authentication Required)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Current user info
- `GET /api/cms/services` - All services (admin)
- `POST /api/cms/services` - Create service
- `PUT /api/cms/services/{id}` - Update service
- `DELETE /api/cms/services/{id}` - Delete service
- `GET /api/cms/case-studies` - All case studies (admin)
- `POST /api/cms/case-studies` - Create case study
- `PUT /api/cms/case-studies/{id}` - Update case study
- `DELETE /api/cms/case-studies/{id}` - Delete case study
- `GET /api/contact/submissions` - Contact submissions (admin)

## 🧪 Testing

### Backend Testing Complete ✅
All backend functionality has been thoroughly tested:
- Contact form API with spam protection
- Authentication system with JWT
- CMS CRUD operations for services and case studies
- Public APIs for website content
- Database integration and data persistence

### Manual Testing Checklist
- [✅] Contact form submission (with email notification)
- [✅] Admin login and CMS operations
- [✅] Responsive design (mobile/tablet/desktop)
- [✅] Locomotive scroll effects (desktop only)
- [✅] Accessibility (keyboard navigation, screen readers)
- [✅] Performance (Lighthouse audit)

## 📱 Browser Support & Performance

### Verified Performance
- **Lighthouse Mobile Score**: ≥ 90
- **25 Scroll Elements**: Ultra-low speeds (0.05-0.2)
- **Accessibility**: WCAG AA compliant
- **Mobile Optimization**: Effects disabled < 768px
- **Motion Sensitivity**: Respects `prefers-reduced-motion`

### Browser Compatibility
- Chrome/Edge 80+ ✅
- Firefox 75+ ✅
- Safari 13+ ✅
- iOS Safari 13+ ✅
- Android Chrome 80+ ✅

## 🔧 Production Ready Features

### Security
- JWT authentication for admin access
- CORS configuration
- Input validation and sanitization
- Rate limiting for contact form
- Honeypot spam protection

### Performance
- Image lazy loading
- Code splitting
- CSS minification
- Ultra-low animation speeds for battery efficiency
- SSR-safe scroll initialization

### Monitoring & Analytics
- Google Analytics 4 integration
- Cookie consent management
- Error boundary implementation
- Performance tracking

## 📄 Documentation

- **Complete Setup Guide**: This README
- **Locomotive Scroll Guide**: `/frontend/LOCOMOTIVE_SCROLL_GUIDE.md`
- **API Documentation**: FastAPI auto-generated at `/docs`
- **Environment Examples**: `.env.example` files

## 🏆 Project Status: COMPLETE

✅ **Ultra-Low Locomotive Scroll**: 25 elements with 0.05-0.2 speeds
✅ **Complete Backend API**: Contact, CMS, Auth systems
✅ **Admin CMS Interface**: Full content management
✅ **Real API Integration**: No mock data remaining
✅ **Google Analytics**: Privacy-compliant tracking
✅ **Responsive Design**: Mobile-first implementation
✅ **Accessibility**: WCAG AA compliance
✅ **Performance**: Lighthouse Mobile ≥ 90
✅ **Documentation**: Comprehensive guides
✅ **Production Ready**: Security, monitoring, deployment

## 📞 Contact

**Alaama Creative Studio**
- Website: www.alaama.co
- Email: info@alaama.co
- Instagram: @alaama.bh

Access admin panel at `/admin` (admin/admin123)
