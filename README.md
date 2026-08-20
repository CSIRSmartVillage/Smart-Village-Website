# 🏡 Smart Village Management Portal

> **CSIR-CBRI Smart Village Mission** — A full-stack web platform for managing, showcasing, and governing smart village initiatives across India.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209.x-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)](https://smart-village-csir-cbri.vercel.app)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Core Features](#-core-features)
- [Database Models](#-database-models)
- [API Reference](#-api-reference)
- [Frontend Pages and Routing](#-frontend-pages-and-routing)
- [Admin Panel](#-admin-panel)
- [Village Portal](#-village-portal)
- [CMS System](#-cms-system)
- [Authentication and Security](#-authentication-and-security)
- [Media Management](#-media-management)
- [Email Service](#-email-service)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Seed Scripts](#-seed-scripts)
- [Deployment](#-deployment)

---

## 🌐 Overview

The **Smart Village Management Portal** is a comprehensive full-stack web application built for the **CSIR-CBRI Smart Village Mission** under IIT Roorkee. It serves as the official digital platform to:

- **Showcase** smart village initiatives and success stories across Indian states
- **Manage** village profiles, development plans, events, and news
- **Inform** citizens about CSIR laboratories, policies, and government schemes
- **Administer** all content via a secure, role-based admin panel
- **Enable** deep village-specific portals with GIS mapping and local insights

The platform is a **monorepo** with two independent packages: a `client` (React/Vite SPA) and a `server` (Node.js/Express REST API).

---

## 🔗 Live Demo

| Environment | URL |
|---|---|
| Frontend (Production) | https://smart-village-csir-cbri.vercel.app |
| Backend API | `https://<your-backend-domain>/api` |

---

## 🏛️ Architecture

```
+----------------------------------------------------------+
|                 CLIENT (Vite + React 19)                  |
|  +------------+  +---------------+  +----------------+   |
|  | Public     |  | Admin Panel   |  | Village Portal |   |
|  | Website    |  | (Protected)   |  | (Per-Village)  |   |
|  +------------+  +---------------+  +----------------+   |
|              React Router DOM v7                          |
+------------------------+---------------------------------+
                         | HTTPS / Axios
                         | JWT Bearer Token
+------------------------v---------------------------------+
|              SERVER (Express 5 + Node.js)                |
|  +------------------------------------------------------+ |
|  |  Middleware Stack                                    | |
|  |  CORS -> Helmet -> Compression -> CookieParser       | |
|  |  -> Rate Limiter -> JWT Auth -> RBAC -> Validation   | |
|  +------------------------------------------------------+ |
|  +------------------------------------------------------+ |
|  |  Module-Based API Routes (/api/*)                    | |
|  |  auth | villages | states | news | success-stories   | |
|  |  cms | labs | announcements | events | media          | |
|  |  development-plans | videos | site-settings | ...    | |
|  +------------------------------------------------------+ |
+----------+---------------------------+-------------------+
           |                           |
+----------v-----------+   +-----------v-----------+
| MongoDB Atlas         |   | Cloudinary CDN        |
| (Mongoose ODM)        |   | (Images/Videos/Files) |
| 15+ Data Models       |   |                       |
+-----------------------+   +-----------------------+
```

---

## 🛠️ Technology Stack

### Frontend (Client)

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI component library |
| **Vite** | 8.x | Build tool and dev server |
| **React Router DOM** | v7 | Client-side routing (SPA) |
| **TailwindCSS** | v4.x | Utility-first CSS framework |
| **@tiptap/react** | 3.x | Rich text editor (WYSIWYG) |
| **Axios** | 1.x | HTTP client for REST API calls |
| **React Hook Form** | 7.x | Performant form state management |
| **Zod** | 4.x | Schema-based form validation |
| **React Hot Toast** | 2.x | Notification toasts |
| **Swiper** | 12.x | Touch-friendly carousels/sliders |
| **Lucide React** | 1.x | Icon library |
| **React Icons** | 5.x | Social and extended icon set |
| **Yet Another React Lightbox** | 3.x | Image gallery lightbox |
| **use-debounce** | 10.x | Debounce hook for search inputs |

### Backend (Server)

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS | JavaScript runtime |
| **Express** | 5.x | Web framework |
| **Mongoose** | 9.x | MongoDB ODM |
| **MongoDB Atlas** | Cloud | NoSQL database |
| **JWT (jsonwebtoken)** | 9.x | Access and refresh token auth |
| **bcryptjs** | 3.x | Password hashing |
| **Cloudinary** | 1.x | Cloud media storage and CDN |
| **Multer** | 2.x | Multipart file upload handling |
| **multer-storage-cloudinary** | 4.x | Cloudinary storage engine for Multer |
| **Nodemailer** | 9.x | SMTP email delivery |
| **Helmet** | 8.x | HTTP security headers |
| **CORS** | 2.x | Cross-Origin Resource Sharing |
| **express-rate-limit** | 8.x | API rate limiting |
| **compression** | 1.x | Gzip response compression |
| **Joi** | 18.x | Request payload validation |
| **Zod** | 4.x | Schema validation (shared) |
| **Slugify** | 1.x | Auto-generate URL slugs |
| **Winston** | 3.x | Structured application logging |
| **Morgan** | 1.x | HTTP request logging |
| **UUID** | 14.x | Unique ID generation |
| **Nodemon** | 3.x | Dev server auto-restart |

---

## 📁 Project Structure

```
Smart_Village/
├── client/                          # React + Vite Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── admin/                   # Admin Panel (Protected)
│   │   │   ├── components/          # Admin-specific UI components
│   │   │   ├── hooks/               # Admin custom hooks
│   │   │   ├── layouts/             # AdminLayout wrapper
│   │   │   ├── pages/               # 39 admin page components
│   │   │   ├── routes/              # AdminRoutes.jsx (protected routing)
│   │   │   ├── services/            # Admin API service calls
│   │   │   ├── utils/               # Admin utilities
│   │   │   └── validations/         # Admin form schemas (Zod)
│   │   ├── app/                     # App-level providers/context
│   │   ├── assets/                  # Images, logos, fonts
│   │   │   └── logos/               # CSIR-CBRI & Smart Village logos
│   │   ├── components/
│   │   │   ├── common/              # Shared components (Header, Footer, Navbar)
│   │   │   └── ui/                  # Base UI primitives
│   │   ├── hooks/                   # Public custom hooks
│   │   ├── layouts/                 # Page layout wrappers
│   │   ├── pages/                   # Public-facing pages (10 sections)
│   │   │   ├── AboutPage/           # About, Mission, DG Desk, Director Desk
│   │   │   ├── AnnouncementPage/    # Announcement detail
│   │   │   ├── ContactPage/         # Contact form
│   │   │   ├── HomePage/            # Home page
│   │   │   ├── LaboratoryPage/      # Lab detail page
│   │   │   ├── NewsPage/            # News list & detail
│   │   │   ├── NodalLabPage/        # CSIR Nodal Lab
│   │   │   ├── ParticipatingLabsPage/  # Participating CSIR labs
│   │   │   ├── SuccessStoriesPage/  # Success stories (list, village, detail)
│   │   │   └── VillagePortal/       # Per-village micro-portal (11 modules)
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx        # Master routing definition
│   │   ├── sections/                # CMS-driven page section renderers (13 groups)
│   │   ├── services/                # Axios API service layer (13 services)
│   │   ├── utils/                   # Client-side helpers
│   │   ├── App.jsx                  # Root component
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # ReactDOM entry point
│   ├── index.html                   # HTML shell
│   ├── vite.config.js               # Vite + TailwindCSS plugin config
│   ├── vercel.json                  # SPA rewrite rules for Vercel
│   └── package.json
│
└── server/                          # Node.js + Express Backend
    ├── src/
    │   ├── app.js                   # Express app setup
    │   ├── server.js                # Server entry point
    │   ├── config/
    │   │   ├── cloudinary.js        # Cloudinary SDK configuration
    │   │   ├── database.js          # MongoDB Atlas connection
    │   │   ├── env.js               # Centralized env variable exports
    │   │   └── logger.js            # Winston logger setup
    │   ├── middleware/
    │   │   ├── auth.middleware.js        # JWT bearer token verification
    │   │   ├── cloudinaryUpload.middleware.js  # Multer + Cloudinary pipeline
    │   │   ├── error.middleware.js       # Global error handler
    │   │   ├── notFound.middleware.js    # 404 handler
    │   │   ├── rateLimit.middleware.js   # Rate limiters
    │   │   ├── rbac.middleware.js        # Role-based access control
    │   │   ├── security.middleware.js    # Helmet security headers
    │   │   └── validate.middleware.js    # Request body validation
    │   ├── models/                  # 15 Mongoose data models
    │   ├── modules/                 # 19 feature modules (controller/routes/service/validation)
    │   │   ├── announcement/
    │   │   ├── auth/
    │   │   ├── cms/
    │   │   ├── contact/
    │   │   ├── developmentPlan/
    │   │   ├── events/
    │   │   ├── laboratory/
    │   │   ├── mediaManagement/
    │   │   ├── navigationManagement/
    │   │   ├── news/
    │   │   ├── pageManagement/
    │   │   ├── sectionManagement/
    │   │   ├── siteSettings/
    │   │   ├── state/
    │   │   ├── successStory/
    │   │   ├── successStoryVillage/
    │   │   ├── video/
    │   │   ├── village/
    │   │   └── villageProfile/
    │   ├── routes/
    │   │   ├── index.js             # Master API router
    │   │   └── health.routes.js     # Health check endpoint
    │   ├── scripts/                 # 28 Database seed scripts
    │   ├── services/
    │   │   ├── audit.service.js     # Audit log service
    │   │   └── email.service.js     # Nodemailer SMTP service
    │   ├── shared/                  # Reusable Mongoose sub-schemas
    │   │   ├── Document.schema.js
    │   │   ├── Gallery.schema.js
    │   │   ├── Media.schema.js
    │   │   └── Seo.schema.js
    │   └── utils/
    │       ├── ApiError.js          # Custom API error class
    │       ├── ApiResponse.js       # Standardized API response wrapper
    │       ├── asyncHandler.js      # Async error wrapper
    │       └── constants/           # Event, status, type constants
    └── package.json
```

---

## ✨ Core Features

### Public Website
- **Dynamic Home Page** — Hero carousel, mission, impact stats, latest updates, featured villages, policies — all CMS-driven
- **About Section** — Organization overview, mission and objectives, DG Desk, Director Desk (rich-text)
- **CSIR Laboratories** — Nodal lab detail, full list of participating labs with individual detail pages
- **News and Updates** — Paginated news with category filters, featured news, slug-based detail pages
- **Success Stories** — Two-level hierarchy: village → story listing → story detail with gallery/video
- **Announcements** — Slug-based announcement detail pages
- **Contact Form** — SMTP-powered email submission with validation
- **Site Settings** — Logo, org name, social links, footer — all managed from admin

### Village Portal (`/village/:slug/*`)
Each village gets a self-contained micro-portal with 11 sub-modules:

| Module | Path | Description |
|---|---|---|
| Village Info | `/` (index) | Hero, overview, event-backed highlights, gallery, contact information |
| Development Plan | `/development-plan` | List of ongoing/future plans |
| Development Plan Detail | `/development-plan/:id` | Full plan details |
| Current Affairs | `/current-affairs` | Local village announcements |
| Events | `/events` | Village events listing |
| Event Detail | `/events/:eventSlug` | Full event info |
| Traditional Food | `/traditional-food` | Local cuisine and recipes |
| Village Map | `/map` | GIS / location information |
| Policies | `/policies` | Government schemes |
| Knowledge Hub | `/knowledge-hub` | Reports, manuals, documents |
| Indicators | `/indicators` | VDI and analytics |
| Feedback | `/feedback` | Citizen feedback form |

### Admin Panel (`/admin/*`)
Complete CMS with 39 admin pages, protected by JWT authentication.

---

## 🗃️ Database Models

The platform uses **15+ Mongoose models** in MongoDB Atlas:

| Model | Key Fields |
|---|---|
| **Admin** | username, email, password (bcrypt, 12 rounds), role (SUPER_ADMIN/ADMIN), assignedVillages[], refreshToken, loginAttempts, lockUntil |
| **Village** | name (en/regional), slug, state (ref), district, block, gramPanchayat, pinCode, location (GeoJSON 2dsphere Point), coverImage, status (ACTIVE/INACTIVE/ARCHIVED) |
| **VillageProfile** | village (ref, unique), heroTitle, heroSubtitle, heroImage, overview, galleryImages[], contactPerson, designation, phone, alternatePhone, email, officeAddress, gramPanchayat, block, district, state, pinCode |
| **State** | name, code, region |
| **News** | title, slug, summary, content (rich text), featuredImage, category (GENERAL/EVENT/ANNOUNCEMENT/SUCCESS_STORY/POLICY), status (DRAFT/PUBLISHED/ARCHIVED), isFeatured, publishedAt |
| **SuccessStory** | title, slug, village (ref SuccessStoryVillage), summary, story, impact, beneficiaries, featuredImage, galleryImages[], videoUrl, isFeatured, status |
| **SuccessStoryVillage** | Separate village entity for success story grouping with slug |
| **Laboratory** | name, slug, type (NODAL/PARTICIPATING), heroImage, directorName, overview, researchAreas[], contributions[], address, phone, email, website |
| **Media** | filename, originalName, url, publicId (Cloudinary), resourceType (image/video/raw), mimeType, size, uploadedBy |
| **Page** | slug, title, meta description — CMS page registry |
| **PageSection** | pageId (ref), sectionType (50+ enum values), title, subtitle, content (Mixed JSON), order, isVisible, metadata |
| **Navigation** | Menu items with labels, URLs, order, hierarchy |
| **SiteSettings** | siteName, organizationName, logoUrl, faviconUrl, contactEmail, contactPhone, address, socialLinks (FB/Twitter/LinkedIn/YouTube/Instagram), copyrightText, footerDescription |
| **AuditLog** | Admin action audit trail |
| **Event** | village (ref), title, slug, type, category, summary, description, coverImage, gallery[], documents[], eventDate, endDate, location, organizer, participants, status (UPCOMING/ONGOING/COMPLETED/CANCELLED), isFeatured, published, seo |
| **DevelopmentPlan** | village (ref), title, slug, category, status (PLANNED/IN_PROGRESS/COMPLETED), timeline, budget, objectives, outcomes, documents[] |
| **Video** | YouTube/external video metadata |
| **Announcement** | title, slug, content, publishedAt |

> **GIS Note**: The Village model uses a `2dsphere` geospatial index on the `location` field for proximity-based map queries.

---

## 🔌 API Reference

All routes are prefixed with `/api`. Base URL: `http://localhost:5000/api`

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |
| GET | `/public/*` | CMS page/section data |
| GET | `/states` | List all states |
| GET | `/villages` | List all villages |
| GET | `/villages/:slug` | Get village by slug |
| GET | `/village-profiles` | List village profiles |
| GET | `/news` | List published news |
| GET | `/news/:slug` | Get news by slug |
| GET | `/success-stories` | List published success stories |
| GET | `/success-stories/:slug` | Get success story by slug |
| GET | `/success-story-villages` | List success story villages |
| GET | `/announcements/:slug` | Get announcement by slug |
| GET | `/laboratories` | List laboratories |
| GET | `/laboratories/:slug` | Get lab by slug |
| GET | `/videos` | List videos |
| GET | `/development-plans` | List development plans (filterable by village) |
| GET | `/events` | List events (filterable by village) |
| GET | `/events/:slug` | Get event by slug |
| GET | `/site-settings` | Get global site settings |
| POST | `/contact` | Submit contact form (sends email) |

### Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Admin login (returns access + refresh token) |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout (clears refresh token) |
| GET | `/auth/me` | Get current admin profile |

### Protected Admin Endpoints (JWT Bearer Token Required)

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/villages` | Manage villages |
| PUT/DELETE | `/villages/:id` | Village CRUD |
| GET/POST | `/village-profiles` | Manage village profiles |
| PUT/DELETE | `/village-profiles/:id` | Village profile CRUD |
| GET/POST | `/news` | Manage news articles |
| PUT/DELETE | `/news/:id` | News CRUD |
| GET/POST | `/success-stories` | Manage success stories |
| GET/POST | `/announcements` | Manage announcements |
| GET/POST | `/laboratories` | Manage CSIR labs |
| GET/POST | `/videos` | Manage videos |
| GET/POST | `/development-plans` | Manage development plans |
| GET/POST | `/events` | Manage village events |
| GET/PUT | `/site-settings` | Manage global site settings |
| GET/POST/DELETE | `/admin/media` | Media library management |
| GET/PUT | `/admin/pages` | CMS page management |
| GET/PUT | `/admin/sections` | CMS section management |
| GET/POST | `/admin/navigation` | Navigation menu management |

---

## 🗺️ Frontend Pages and Routing

### Public Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | Main landing page |
| `/about` | `AboutPage` | Organization overview |
| `/about/mission-objectives` | `MissionObjectivesPage` | Mission and objectives |
| `/about/dg-desk` | `DGDeskPage` | Director-General's message |
| `/about/director-desk` | `DirectorDeskPage` | Director's message |
| `/csir-laboratories/nodal-lab` | `NodalLabPage` | CSIR-CBRI nodal lab |
| `/csir-laboratories/participating-labs` | `ParticipatingLabsPage` | All participating labs |
| `/participating-labs/:slug` | `LaboratoryDetailPage` | Individual lab detail |
| `/news-updates` | `NewsPage` | News listing |
| `/news/:slug` | `NewsDetailPage` | News article detail |
| `/success-stories` | `SuccessStoriesPage` | Stories by village |
| `/success-stories/:villageSlug` | `VillageSuccessStoriesPage` | Village stories list |
| `/success-stories/:villageSlug/:storySlug` | `SuccessStoryDetailPage` | Full story detail |
| `/announcements/:slug` | `AnnouncementDetailPage` | Announcement detail |
| `/contact` | `ContactPage` | Contact form |
| `/village/:slug/*` | `VillageLayout` | Village portal nested routes |

### Village Portal Routes (`/village/:slug/`)

| Path | Component |
|---|---|
| (index) | `VillageInfoPage` |
| `development-plan` | `DevelopmentPlanPage` |
| `development-plan/:id` | `DevelopmentPlanDetailPage` |
| `current-affairs` | `CurrentAffairsPage` |
| `events` | `EventsPage` |
| `events/:eventSlug` | `EventDetailPage` |
| `traditional-food` | `TraditionalFoodPage` |
| `map` | `VillageMapPage` |
| `policies` | `PoliciesPage` |
| `knowledge-hub` | `KnowledgeHubPage` |
| `indicators` | `IndicatorsPage` |
| `feedback` | `FeedbackPage` |

---

## 🔐 Admin Panel

The admin panel at `/admin/*` is a fully protected CMS.

### Authentication Flow
1. Admin visits `/admin/login` and submits credentials
2. Server validates and returns `accessToken` (8 hours) and `refreshToken` (7 days)
3. `accessToken` stored in `localStorage`, sent as `Authorization: Bearer <token>` header
4. `ProtectedRoute` component checks token presence; redirects to login if missing
5. Expired access tokens are renewed transparently via `/auth/refresh`; an invalid or expired refresh session redirects to login

### Admin Roles

| Role | Permissions |
|---|---|
| `SUPER_ADMIN` | Full access to all resources and villages |
| `ADMIN` | Scoped access; `assignedVillages[]` controls which villages they can manage |

### Admin Pages (39 pages)

**Content Management**
- Dashboard, Pages, Page Sections Editor, Home Sections Manager
- Navigation Menu (Create/Edit/Delete)
- Media Library (Upload/Browse/Delete via Cloudinary)

**News and Communications**
- News Management (List/Create/Edit)
- Announcements (List/Create/Edit)
- Videos (List/Create/Edit)

**CSIR Laboratories**
- Laboratories (List/Create/Edit) — NODAL and PARTICIPATING types

**Success Stories**
- Success Story Villages (List/Create/Edit)
- Success Stories (List/Create/Edit)

**Smart Village Management**
- Smart Village Dashboard (hub for all village modules)
- Village Profiles (List/Create/Edit)
- Development Plans (List/Create/Edit)
- Events (List/Create/Edit)

---

## 🏘️ Village Portal

The Village Portal (`/village/:slug`) is a per-village micro-portal rendered within a shared `VillageLayout`. Each village identified by its unique `slug` gets dedicated navigation and 11 functional modules.

### VillageLayout
- Fetches village data using `useVillage(slug)` hook
- Provides village context to all child routes
- Renders village-specific navigation sidebar/header

### Data Hooks Used

| Hook | Purpose |
|---|---|
| `useVillage(slug)` | Fetch single village data |
| `useVillages()` | Fetch all villages |
| `useDevelopmentPlans(villageId)` | Village development plans |
| `useEvents(villageId)` | Village events with filtering |
| `usePublicEvents()` | Public events listing |
| `useStates()` | All Indian states |
| `useNavigation()` | Navigation menu items |
| `useSiteSettings()` | Global site config (logo, footer) |
| `usePage(slug)` | CMS page sections |

---

## 📝 CMS System

The platform uses a **database-driven CMS** where every page's content is stored in MongoDB and editable via the admin panel without code changes.

### How It Works

1. **Pages** are registered in the `Page` model with a slug (e.g., `home`, `about`)
2. Each page has multiple **PageSections** ordered by the `order` field
3. Each `PageSection` has a `sectionType` enum (50+ types) and a flexible `content` field (Mixed JSON)
4. The frontend fetches sections via `/api/public/:pageSlug`
5. Section-type-specific React components render the content dynamically

### Supported Section Types (50+)

`HERO`, `MISSION`, `IMPACT_STATISTICS`, `LATEST_UPDATES`, `POLICIES`, `VILLAGES`, `FOOTER`, `RICH_TEXT`, `CARDS`, `GALLERY`, `TIMELINE`, `FAQ`, `CONTACT`, `NEWS_FEED`, `VILLAGE_GRID`, `ABOUT_HERO`, `ABOUT_GALLERY`, `ABOUT_OVERVIEW`, `ABOUT_VISION`, `ABOUT_MISSION`, `ABOUT_OBJECTIVES`, `ABOUT_HISTORY`, `ABOUT_CBRI`, `PROFILE_HERO`, `PROFILE_MESSAGE`, `PROFILE_BIO`, `CSIR_LABS_HERO`, `CSIR_LABS_OVERVIEW`, `CSIR_LABS_ROLE`, `CSIR_LABS_NETWORK`, `NODAL_LAB_HERO`, `NODAL_LAB_RESPONSIBILITIES`, `NODAL_LAB_RESEARCH_AREAS`, `PARTICIPATING_LABS_HERO`, `PARTICIPATING_LABS_LIST`, `SMART_VILLAGE_HERO`, `SMART_VILLAGE_OVERVIEW`, `CONTACT_HERO`, `CONTACT_FORM`, `NEWS_HERO`, `SUCCESS_STORIES_HERO`, and more.

### Section Editor
`EditSectionPage.jsx` provides a dynamic form UI that adapts based on `sectionType` — allowing admins to edit hero images, rich text, card arrays, gallery items, and metadata through a single interface.

---

## 🔒 Authentication and Security

### Security Middleware Stack

```
Request → CORS → Helmet (CSP, XSS headers) → Compression → Cookie Parser
        → Rate Limiter → JWT Verification → RBAC → Route Handler
```

### Rate Limiting

| Limiter | Window | Max Requests |
|---|---|---|
| Global | 15 minutes | 100 requests |
| Auth endpoints | 15 minutes | 10 requests |

### Password Security
- Passwords hashed with **bcryptjs** (salt rounds: 12)
- Account lockout via `loginAttempts` and `lockUntil` fields on Admin model

### Token Strategy

| Token | Expiry | Storage | Use |
|---|---|---|---|
| Access Token | 8 hours | localStorage (client) | API Authorization header |
| Refresh Token | 7 days | MongoDB (server) | Token renewal |

### CORS Configuration
Allowed origins:
- `http://localhost:5173` (development)
- `https://smart-village-csir-cbri.vercel.app` (production)

---

## 🖼️ Media Management

All media is stored in **Cloudinary** and referenced in MongoDB via the `Media` model.

### Upload Flow
1. Client sends `multipart/form-data` to `/api/admin/media/upload`
2. `cloudinaryUpload.middleware.js` processes with **Multer** + `multer-storage-cloudinary`
3. File is uploaded directly to Cloudinary; `publicId`, `url`, `mimeType`, `size` saved to MongoDB
4. Media can be browsed from the **Media Library** admin page
5. Any model references media via `mongoose.Schema.Types.ObjectId` → `ref: "Media"`

### Supported Resource Types
- `image` — JPG, PNG, WebP, SVG
- `video` — MP4, WebM
- `raw` — PDFs, documents

---

## 📧 Email Service

The contact form uses **Nodemailer** with SMTP (Gmail or any SMTP provider).

### Contact Email Flow
1. User submits the contact form at `/contact`
2. Server validates with Joi schema
3. `sendContactEmail()` called from `email.service.js`
4. HTML-formatted email sent to `CONTACT_RECEIVER` with `Reply-To` set to the user's email
5. Subject prefixed with the emoji for visibility

---

## ⚙️ Environment Variables

### Server (`server/.env`)

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/?appName=Cluster0

# JWT Secrets
JWT_ACCESS_SECRET=your_strong_access_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
ACCESS_TOKEN_EXPIRY=8h
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Contact
CONTACT_RECEIVER=contact_receiver@example.com
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/Milan0407/Smart_Village_IIT_Roorkee.git
cd Smart_Village
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create `server/.env` from the template above, then:

```bash
npm run dev
```

Server starts on `http://localhost:5000`

### 3. Setup the Client

```bash
cd client
npm install
npm run dev
```

Client starts on `http://localhost:5173`

### 4. Create the Super Admin

```bash
cd server
npm run seed:admin
```

### 5. Seed Initial Data (Optional but Recommended)

```bash
# Seed Indian States
npm run seed:states

# Seed Villages
npm run seed:villages
```

For CMS content, run individual scripts:

```bash
node src/scripts/seedPages.js
node src/scripts/seedNavigation.js
node src/scripts/seedSiteSettings.js
node src/scripts/seedHomeContent.js
node src/scripts/seedAboutContent.js
# See scripts/ directory for all available seed scripts
```

---

## 🌱 Seed Scripts

The server includes **28 database seed scripts** to bootstrap content:

| Script | Purpose |
|---|---|
| `createSuperAdmin.js` | Create the first SUPER_ADMIN account |
| `seedStates.js` | Populate Indian states |
| `seedVillages.js` | Populate sample villages |
| `seedPages.js` | Register CMS pages |
| `seedNavigation.js` | Create navigation menu |
| `seedSiteSettings.js` | Initialize site settings |
| `seedHomeContent.js` | Home page sections content |
| `seedHomeSections.js` | Home page section structure |
| `seedAboutContent.js` | About page content |
| `seedAboutSections.js` | About page sections |
| `seedMissionObjectivesContent.js` | Mission and objectives content |
| `seedMissionObjectivesSections.js` | Mission section structure |
| `seedDGDeskContent.js` | DG Desk page content |
| `seedDGDeskSections.js` | DG Desk section structure |
| `seedDirectorDeskContent.js` | Director Desk page content |
| `seedDirectorDeskSections.js` | Director Desk section structure |
| `seedCSIRLabsContent.js` | CSIR Labs page content |
| `seedCSIRLabsSections.js` | CSIR Labs section structure |
| `seedParticipatingLabsContent.js` | Participating labs content |
| `seedParticipatingLabsSections.js` | Participating labs sections |
| `seedSmartVillageContent.js` | Smart village overview content |
| `seedSmartVillageSections.js` | Smart village section structure |
| `seedContactContent.js` | Contact page content |
| `seedContactSections.js` | Contact page sections |
| `seedNews.js` | Sample news articles |
| `seedNewsSections.js` | News page section structure |
| `seedSuccessStorySections.js` | Success stories page sections |
| `seedDevelopmentPlans.js` | Sample development plans |

---

## 🚢 Deployment

### Frontend — Vercel

The `client/vercel.json` configures SPA rewrites. When the frontend is deployed on Vercel, `VITE_API_URL` must be the full URL of the separately deployed Express API; do not use `/api` unless your hosting platform is proxying that path to the backend.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Deploy steps:**
1. Connect your GitHub repo to Vercel (https://vercel.com)
2. Set **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL=https://your-backend.com/api` (the deployed Express API, including `/api`)
4. Deploy

### Backend — Railway / Render / VPS

1. Set all required environment variables on your host
2. Run `npm start` (uses `node src/server.js`)
3. Ensure MongoDB Atlas allows connections from your server IP

### Production Checklist

- [ ] Change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to strong random strings
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Use Gmail App Password (not account password) for SMTP
- [ ] Update CORS `origin` array in `server/src/app.js` with your production frontend URL
- [ ] Rotate Cloudinary API keys for production

---

## 🗂️ Module Architecture Pattern

Every backend feature follows a consistent **4-file module pattern**:

```
modules/<feature>/
├── <feature>.controller.js   # HTTP handlers (thin, delegates to service)
├── <feature>.routes.js       # Express router (auth + RBAC middleware applied here)
├── <feature>.service.js      # Business logic (DB queries, data transforms)
└── <feature>.validation.js   # Joi/Zod schemas for request validation
```

The `asyncHandler` utility wraps all controller functions to forward errors to the global error middleware automatically.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is developed for the **CSIR-CBRI Smart Village Mission** under IIT Roorkee. All rights reserved.

---

## 👤 Author

**Milan Chauhan**
CSIR-CBRI Roorkee — Smart Village Mission Project

---

*Built with love for rural India's digital transformation*
