# LaolimHeang Portfolio & Digital Services Platform

## Project Overview

**Project Name:** LaolimHeang Portfolio & Digital Services Platform

**Purpose:** A premium professional portfolio website combined with a digital services platform. This is a full-stack application designed for professionals, agencies, and digital service providers to showcase their work, manage services, publish blogs, and track visitor analytics.

**Main Features:**
- Modern, responsive portfolio showcase
- 3D animated hero section
- Service management and pricing
- Project portfolio management
- Blog publishing system
- Admin dashboard with full CRUD operations
- Visitor analytics and tracking
- Contact form with Telegram integration
- Firebase authentication for admin access
- SEO-optimized pages

**Technology Stack:**
- **Frontend:** React.js 19 with Create React App
- **Styling:** Tailwind CSS with custom configuration
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Routing:** React Router DOM
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **State Management:** Context API + React Hooks
- **Testing:** React Testing Library, Jest

---

## Features

### Public Website Features
- ✅ Landing Page with Hero Section
- ✅ 3D Animations and Interactive Elements
- ✅ Portfolio/Projects System
- ✅ Blog Publishing System
- ✅ Services & Pricing Plans
- ✅ About & Profile Section
- ✅ Contact Form with Telegram Integration
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Dark Mode Support
- ✅ SEO-Friendly Pages

### Admin Dashboard Features
- ✅ Firebase Authentication (Admin Login/Logout)
- ✅ Protected Routes
- ✅ Dashboard Analytics
- ✅ Services Management (Add, Edit, Delete)
- ✅ Projects Management (Add, Edit, Delete)
- ✅ Blogs Management (Add, Edit, Delete)
- ✅ Messages Management (View, Delete, Export to CSV)
- ✅ Analytics Viewer (Visitor Tracking, Page Views)
- ✅ Settings Management (Site Configuration)

### Advanced Features
- ✅ Visitor Analytics Tracking
- ✅ Firebase Storage Integration
- ✅ Contact Form Validation
- ✅ Loading States & Error Handling
- ✅ Responsive Image Handling
- ✅ SEO Meta Tags

---

## Folder Structure

```
laolimheang/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── LandingSpinner.js
│   │   │   └── Breadcrumb.js
│   │   │
│   │   ├── ui/
│   │   │   ├── Card.js
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Modal.js
│   │   │   ├── Toast.js
│   │   │   └── Badge.js
│   │   │
│   │   ├── layout/
│   │   │   ├── MainLayout.js
│   │   │   ├── AdminLayout.js
│   │   │   └── PageContainer.js
│   │   │
│   │   ├── hero/
│   │   │   ├── HeroSection.js
│   │   │   └── ThreeScene.js
│   │   │
│   │   ├── about/
│   │   │   ├── ProfileSection.js
│   │   │   ├── SkillsSection.js
│   │   │   ├── ExperienceTimeline.js
│   │   │   └── TechStack.js
│   │   │
│   │   ├── services/
│   │   │   ├── ServiceCard.js
│   │   │   ├── ServiceGrid.js
│   │   │   └── PricingTable.js
│   │   │
│   │   ├── portfolio/
│   │   │   ├── ProjectCard.js
│   │   │   ├── ProjectGrid.js
│   │   │   └── ProjectFilter.js
│   │   │
│   │   ├── blog/
│   │   │   ├── BlogCard.js
│   │   │   ├── BlogGrid.js
│   │   │   ├── BlogFilter.js
│   │   │   └── BlogDetail.js
│   │   │
│   │   └── contact/
│   │       └── ContactForm.js
│   │
│   ├── pages/
│   │   ├── Home.js
│   │   ├── About.js
│   │   ├── Services.js
│   │   ├── Portfolio.js
│   │   ├── Blog.js
│   │   ├── BlogPost.js
│   │   ├── Contact.js
│   │   └── NotFound.js
│   │
│   ├── admin/
│   │   ├── AdminLogin.js
│   │   ├── Dashboard.js
│   │   ├── ServicesAdmin.js
│   │   ├── ProjectsAdmin.js
│   │   ├── BlogsAdmin.js
│   │   ├── MessagesAdmin.js
│   │   ├── AnalyticsAdmin.js
│   │   └── SettingsAdmin.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFirestore.js
│   │   ├── useStorage.js
│   │   └── useAnalytics.js
│   │
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── SettingsContext.js
│   │   └── ToastContext.js
│   │
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.js
│   │   │   ├── auth.js
│   │   │   ├── firestore.js
│   │   │   └── storage.js
│   │   │
│   │   ├── api/
│   │   │   ├── telegramService.js
│   │   │   └── analyticsService.js
│   │   │
│   │   └── validation/
│   │       └── validators.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── dateHelper.js
│   │   ├── formatters.js
│   │   ├── localStorage.js
│   │   └── errorHandler.js
│   │
│   ├── data/
│   │   ├── skills.js
│   │   ├── experience.js
│   │   ├── education.js
│   │   └── testimonials.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── animations.css
│   │   └── variables.css
│   │
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
│
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

### Folder Explanations

| Folder | Purpose |
|--------|---------|
| `public/` | Static files served directly |
| `assets/` | Images, icons, and other media files |
| `components/` | Reusable React components organized by feature |
| `components/common/` | Shared components used across app (Navbar, Footer) |
| `components/ui/` | UI library components (Button, Card, Input) |
| `components/layout/` | Layout wrapper components |
| `pages/` | Full-page components for each route |
| `admin/` | Admin dashboard pages |
| `hooks/` | Custom React hooks for logic reuse |
| `context/` | Context API for global state management |
| `services/` | External service integrations (Firebase, APIs) |
| `services/firebase/` | Firebase configuration and methods |
| `utils/` | Helper functions and utilities |
| `data/` | Static data files (skills, experience, etc) |
| `styles/` | Global CSS and CSS modules |

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it "LaolimHeang" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create Project"

### 2. Authentication Setup

**Enable Email/Password Authentication:**
1. Go to "Build" → "Authentication"
2. Click "Get started"
3. Click "Email/Password" provider
4. Enable it and save

**Create Admin User:**
1. Go to "Users" tab
2. Click "Add user"
3. Enter admin email and password
4. Click "Add user"

### 3. Firestore Setup

**Create Database:**
1. Go to "Build" → "Firestore Database"
2. Click "Create database"
3. Start in **Production mode**
4. Choose your region
5. Click "Create"

**Create Collections:**

Create the following collections in Firestore:

#### users
```
{
  uid: string,
  email: string,
  displayName: string,
  role: "admin",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### services
```
{
  id: string,
  title: string,
  description: string,
  price: number,
  currency: string,
  features: array,
  icon: string,
  category: string,
  featured: boolean,
  order: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### projects
```
{
  id: string,
  title: string,
  description: string,
  category: string,
  image: string,
  liveUrl: string,
  githubUrl: string,
  technologies: array,
  featured: boolean,
  order: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### blogs
```
{
  id: string,
  title: string,
  slug: string,
  thumbnail: string,
  content: string,
  category: string,
  tags: array,
  author: string,
  views: number,
  published: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### messages
```
{
  id: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  read: boolean,
  createdAt: timestamp
}
```

#### visitors
```
{
  id: string,
  visitorId: string,
  userAgent: string,
  referer: string,
  page: string,
  deviceType: string,
  country: string,
  city: string,
  timestamp: timestamp
}
```

#### settings
```
{
  siteName: string,
  logo: string,
  description: string,
  email: string,
  phone: string,
  address: string,
  telegramUsername: string,
  socialLinks: {
    twitter: string,
    github: string,
    linkedin: string,
    facebook: string
  },
  footerText: string,
  seoTitle: string,
  seoDescription: string,
  seoKeywords: array,
  updatedAt: timestamp
}
```

### 4. Storage Setup

1. Go to "Build" → "Storage"
2. Click "Get started"
3. Choose your region
4. Click "Done"

**Create Folders:**
- `projects/` - for project images
- `blogs/` - for blog thumbnails
- `settings/` - for logo and site images

### 5. Security Rules

**Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public collections - read only
    match /services/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && request.auth.token.isAdmin == true;
    }
    
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && request.auth.token.isAdmin == true;
    }
    
    match /blogs/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && request.auth.token.isAdmin == true;
    }
    
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && request.auth.token.isAdmin == true;
    }
    
    // Admin only
    match /messages/{document=**} {
      allow read: if request.auth.uid != null && request.auth.token.isAdmin == true;
      allow delete: if request.auth.uid != null && request.auth.token.isAdmin == true;
    }
    
    match /visitors/{document=**} {
      allow read: if request.auth.uid != null && request.auth.token.isAdmin == true;
      allow create: if true;
    }
    
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

**Storage Security Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && request.auth.token.isAdmin == true;
    }
  }
}
```

---

## Telegram Setup

### 1. Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/start` and follow instructions
3. Send `/newbot`
4. Choose a name for your bot
5. BotFather will give you a **Bot Token**
6. Save this token securely

### 2. Get Chat ID

1. Create a new Telegram group or use existing
2. Add your bot to the group
3. Send a message in the group
4. Open this URL: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Find your group ID in the response (negative number)
6. Save this as **Chat ID**

### 3. Integration

The contact form will automatically send messages to your Telegram bot when someone submits the form.

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Telegram Configuration
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
REACT_APP_TELEGRAM_CHAT_ID=your_chat_id_here

# API Configuration
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development

# Analytics
REACT_APP_ENABLE_ANALYTICS=true
```

See `.env.example` for a template.

---

## Installation Guide

### Prerequisites
- Node.js 16+ and npm 8+
- Firebase account
- Telegram bot token
- Git

### Step-by-Step Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd laolimheang
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Firebase Setup
- Follow Firebase Setup section above
- Get your Firebase credentials from Project Settings

#### 4. Environment Configuration
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

Add your Firebase credentials and Telegram bot details.

#### 5. Install Additional Dependencies
```bash
npm install framer-motion three @react-three/fiber @react-three/drei react-router-dom react-icons react-hook-form axios firebase
```

#### 6. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

#### 7. Test Admin Login
- Go to `http://localhost:3000/admin/login`
- Use the admin credentials you created in Firebase
- You should be redirected to the dashboard

### Verification Checklist
- [ ] Development server runs without errors
- [ ] Public pages load correctly
- [ ] Admin login works
- [ ] Firebase connection established
- [ ] Can view dashboard
- [ ] Contact form appears on contact page

---

## Deployment Guide

### Netlify Deployment

#### Setup
1. Create account at [Netlify](https://www.netlify.com/)
2. Connect your Git repository
3. Set build command: `npm run build`
4. Set publish directory: `build`

#### Environment Variables
1. Go to "Site settings" → "Build & deploy" → "Environment"
2. Add all variables from `.env.local`
3. Redeploy site

#### Deploy
```bash
npm run build
# Or push to git, Netlify auto-deploys
```

### Vercel Deployment

#### Setup
1. Create account at [Vercel](https://vercel.com/)
2. Import your Git repository
3. Vercel auto-detects React app settings

#### Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add all variables from `.env.local`
3. Redeploy

#### Deploy
```bash
# Push to git, Vercel auto-deploys
```

### Firebase Hosting

#### Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting
```

#### Configuration
Select your Firebase project and configure:
- Public directory: `build`
- Single-page app: Yes
- Overwrite: No

#### Deploy
```bash
npm run build
firebase deploy
```

---

## Database Collections

### 1. users

**Purpose:** Store admin user information

**Fields:**
- `uid` (string) - Firebase UID
- `email` (string) - User email
- `displayName` (string) - User's display name
- `role` (string) - "admin"
- `avatar` (string) - Profile image URL
- `createdAt` (timestamp) - Account creation date
- `updatedAt` (timestamp) - Last update date

### 2. services

**Purpose:** Store service offerings and pricing plans

**Fields:**
- `id` (string) - Unique identifier
- `title` (string) - Service title
- `description` (string) - Service description
- `price` (number) - Service price
- `currency` (string) - Currency code (USD, EUR, etc)
- `features` (array) - List of features included
- `icon` (string) - Icon name or URL
- `category` (string) - Service category
- `featured` (boolean) - Show on homepage
- `order` (number) - Display order
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update date

### 3. projects

**Purpose:** Store portfolio projects

**Fields:**
- `id` (string) - Unique identifier
- `title` (string) - Project title
- `description` (string) - Project description
- `category` (string) - Project category
- `image` (string) - Project image URL (Firebase Storage)
- `liveUrl` (string) - Live project URL
- `githubUrl` (string) - GitHub repository URL
- `technologies` (array) - Technologies used
- `featured` (boolean) - Show on homepage
- `order` (number) - Display order
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update date

### 4. blogs

**Purpose:** Store blog posts

**Fields:**
- `id` (string) - Unique identifier
- `title` (string) - Blog title
- `slug` (string) - URL-friendly slug
- `thumbnail` (string) - Blog thumbnail URL
- `content` (string) - Blog content (HTML or Markdown)
- `category` (string) - Blog category
- `tags` (array) - Blog tags
- `author` (string) - Author name
- `views` (number) - View count
- `published` (boolean) - Publication status
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update date

### 5. messages

**Purpose:** Store contact form messages

**Fields:**
- `id` (string) - Unique identifier
- `name` (string) - Visitor name
- `email` (string) - Visitor email
- `subject` (string) - Message subject
- `message` (string) - Message content
- `read` (boolean) - Read status
- `createdAt` (timestamp) - Message date

### 6. visitors

**Purpose:** Track visitor analytics

**Fields:**
- `id` (string) - Unique identifier
- `visitorId` (string) - Session identifier
- `userAgent` (string) - Browser user agent
- `referer` (string) - Referring page
- `page` (string) - Current page URL
- `deviceType` (string) - Device type (mobile, desktop, tablet)
- `country` (string) - Visitor country
- `city` (string) - Visitor city
- `timestamp` (timestamp) - Visit time

### 7. settings

**Purpose:** Store website configuration

**Fields:**
- `siteName` (string) - Website name
- `logo` (string) - Logo URL
- `description` (string) - Site description
- `email` (string) - Contact email
- `phone` (string) - Contact phone
- `address` (string) - Physical address
- `telegramUsername` (string) - Telegram handle
- `socialLinks` (object) - Social media links
  - `twitter` (string) - Twitter URL
  - `github` (string) - GitHub URL
  - `linkedin` (string) - LinkedIn URL
  - `facebook` (string) - Facebook URL
- `footerText` (string) - Footer content
- `seoTitle` (string) - SEO title
- `seoDescription` (string) - SEO description
- `seoKeywords` (array) - SEO keywords
- `updatedAt` (timestamp) - Last update

---

## Admin Dashboard Guide

### Dashboard

**Overview:**
- Total visitors count
- Unique visitors count
- Total messages received
- Total projects
- Total blogs published
- Total services

**Widgets:**
- Visitor analytics chart
- Recent messages list
- Latest projects
- Recent blog posts

### Services Management

**Features:**
- View all services
- Add new service
- Edit existing service
- Delete service
- Manage pricing tiers
- Set featured services

**Fields:**
- Service title
- Description
- Price
- Features (array)
- Category
- Featured toggle
- Display order

### Projects Management

**Features:**
- View all projects
- Add new project with image upload
- Edit project details
- Delete project
- Manage project images (Firebase Storage)
- Set featured projects

**Fields:**
- Project title
- Description
- Category
- Image upload
- Live URL
- GitHub URL
- Technologies
- Featured toggle
- Display order

### Blogs Management

**Features:**
- View all blog posts
- Create new blog with rich text editor
- Edit blog content
- Delete blog
- Upload thumbnail
- Manage blog categories and tags
- Publish/Draft status

**Fields:**
- Blog title
- Slug (auto-generated)
- Thumbnail
- Content (rich text)
- Category
- Tags
- Publication status

### Messages Management

**Features:**
- View all contact messages
- Mark as read/unread
- Delete message
- Export messages to CSV
- Search and filter messages
- View message details

**Columns:**
- Name
- Email
- Subject
- Date
- Status (Read/Unread)

### Analytics

**Metrics Displayed:**
- Total page visits
- Unique visitors
- Daily visitor trend (Chart)
- Weekly visitor trend (Chart)
- Most viewed pages
- Device type distribution (Chart)
- Top referrers
- Visitor growth

### Settings Management

**Configuration Options:**
- Website name
- Logo upload
- Site description
- Contact email
- Phone number
- Address
- Telegram username
- Social media links
- Footer content
- SEO settings (title, description, keywords)

---

## Running the Application

### Development
```bash
npm start
```
Runs on `http://localhost:3000`

### Production Build
```bash
npm run build
```
Creates optimized build in `build/` folder

### Testing
```bash
npm test
```
Runs Jest tests

### Format Code
```bash
npm run format
```

---

## Key Technologies

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| Firebase | Backend services |
| Three.js | 3D graphics |
| Framer Motion | Animations |
| React Hook Form | Form handling |
| Axios | HTTP requests |
| Context API | State management |

---

## Security Considerations

1. **Environment Variables:** Never commit `.env.local` to git
2. **Firebase Rules:** Use provided security rules to restrict access
3. **Authentication:** Only admin users can access dashboard
4. **File Uploads:** Validate file types and sizes
5. **Input Validation:** Sanitize all user inputs
6. **CORS:** Configure Firebase CORS properly

---

## Troubleshooting

### Firebase Connection Issues
- Verify API keys in `.env.local`
- Check Firestore is created
- Verify security rules allow connections

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Admin Login Issues
- Verify user exists in Firebase Authentication
- Check email/password is correct
- Clear browser localStorage
- Check console for error messages

---

## Support & Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## License

This project is proprietary. Unauthorized copying or distribution is prohibited.

---

## Changelog

### Version 1.0.0 (Initial Release)
- Initial project setup
- Basic portfolio functionality
- Admin dashboard
- Firebase integration
- Telegram contact form
- Visitor analytics

---

**Last Updated:** June 1, 2026
**Maintained by:** LaolimHeang Team
