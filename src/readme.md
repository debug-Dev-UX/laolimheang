IMPORTANT INSTRUCTION:

Before generating any code, FIRST create a complete and detailed README.md file.

The README.md must be generated before all other files and must explain the entire application architecture.

README.md must include:

# Project Overview

* Project name
* Purpose of the application
* Main features
* Technology stack

# Features

* Landing Page
* 3D Animations
* Portfolio System
* Blog System
* Services System
* Admin Dashboard
* Firebase Authentication
* Firebase Firestore
* Firebase Storage
* Telegram Contact Form
* Visitor Analytics
* SEO Features
* Responsive Design

# Folder Structure

Provide a complete folder tree and explain every folder and important file.

Example:

src/
├── assets/
├── components/
│   ├── common/
│   ├── ui/
│   ├── layout/
│   └── three/
├── pages/
├── admin/
├── hooks/
├── context/
├── services/
├── firebase/
├── utils/
├── data/
├── styles/
├── App.js
└── index.js

Explain the purpose of every folder.

# Firebase Setup

* Authentication Setup
* Firestore Setup
* Storage Setup
* Security Rules

# Telegram Setup

* Bot Token
* Chat ID
* Contact Form Integration

# Environment Variables

Provide .env.example

# Installation Guide

Step-by-step setup instructions.

# Deployment Guide

Netlify
Vercel
Firebase Hosting

# Database Collections

services
projects
blogs
messages
visitors
settings
users

Explain fields for each collection.

# Admin Dashboard Guide

Explain all admin pages and permissions.

After README.md is completed, generate the entire application.

---

PROJECT REQUIREMENTS

Project Name:
LaolimHeang Portfolio & Digital Services Platform

Framework:

* React.js (Create React App)
* Tailwind CSS

Libraries:

* Framer Motion
* Three.js
* React Three Fiber
* React Three Drei
* React Icons
* React Router DOM
* Firebase
* EmailJS (optional)

Backend:

* Firebase Authentication
* Firebase Firestore
* Firebase Storage

Design Requirements:

Create a premium professional portfolio website with modern UI/UX.

The website must look similar to a high-end SaaS, agency, or developer portfolio website.

Use:

* Glassmorphism
* Smooth animations
* 3D effects
* Scroll animations
* Interactive elements
* Modern cards
* Professional typography
* Responsive layouts

Color Scheme:

* Blue
* White
* Dark Mode Support

---

PUBLIC WEBSITE

Pages:

1. Home
2. About
3. Services
4. Portfolio
5. Blog
6. Contact

---

HOME PAGE

Include:

* Hero Section
* 3D Animated Scene
* Introduction
* CTA Buttons
* Statistics
* Services Preview
* Featured Projects
* Latest Blogs
* Testimonials
* Contact CTA

---

ABOUT PAGE

Include:

* Profile Section
* Skills
* Experience
* Education
* Technologies
* Timeline

---

SERVICES PAGE

Create Service Plans:

1. Basic
2. Pro
3. Premium
4. Plus

Each service contains:

* Title
* Description
* Price
* Features
* Button

Load all services from Firebase.

---

PORTFOLIO PAGE

Admin can:

* Add Project
* Edit Project
* Delete Project

Project fields:

* Title
* Description
* Category
* Image
* Live URL
* Github URL
* Featured

Store in Firestore.

Images stored in Firebase Storage.

---

BLOG PAGE

Admin can:

* Add Blog
* Edit Blog
* Delete Blog

Blog fields:

* Title
* Slug
* Thumbnail
* Content
* Category
* Tags
* Created Date

Store in Firestore.

---

CONTACT PAGE

Form Fields:

* Name
* Email
* Subject
* Message

When submitted:

1. Save to Firestore
2. Send to Telegram Bot

Show:

* Loading State
* Success Message
* Error Message

---

VISITOR ANALYTICS

Automatically record visits.

Create Firebase visitor tracking system.

Track:

* Total Visits
* Unique Visitors
* Daily Visitors
* Weekly Visitors
* Monthly Visitors
* Most Viewed Pages
* Device Type

Dashboard Analytics:

* Total Visits
* Unique Visitors
* Messages
* Projects
* Blogs
* Services

Create charts for analytics.

---

AUTHENTICATION

Firebase Authentication:

* Admin Login
* Admin Logout
* Protected Routes

Only admin can access dashboard.

---

ADMIN DASHBOARD

Sidebar:

* Dashboard
* Services
* Projects
* Blogs
* Messages
* Analytics
* Settings

---

SERVICES MANAGEMENT

Admin can:

* Add Service
* Edit Service
* Delete Service

---

PROJECT MANAGEMENT

Admin can:

* Add Project
* Edit Project
* Delete Project

---

BLOG MANAGEMENT

Admin can:

* Add Blog
* Edit Blog
* Delete Blog

---

MESSAGES MANAGEMENT

Admin can:

* View Messages
* Delete Messages
* Export Messages to CSV

---

ANALYTICS MANAGEMENT

Admin can view:

* Total Visits
* Unique Visitors
* Traffic Trends
* Popular Pages

---

SETTINGS MANAGEMENT

Admin can update:

* Website Name
* Logo
* Contact Information
* Telegram Username
* Social Links
* Footer Content
* SEO Settings

Store all settings in Firebase.

---

FIREBASE COLLECTIONS

users
services
projects
blogs
messages
visitors
settings

Create Firestore schemas and explain them.

---

ENVIRONMENT VARIABLES

Generate .env.example

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

REACT_APP_TELEGRAM_BOT_TOKEN=
REACT_APP_TELEGRAM_CHAT_ID=

---

CODE REQUIREMENTS

* Clean Architecture
* Reusable Components
* React Hooks
* Context API
* Firebase Services Layer
* Responsive Design
* SEO Friendly
* Production Ready
* Error Handling
* Loading States
* Form Validation

---

FINAL INSTRUCTION

1. Generate README.md FIRST.
2. Then generate folder structure.
3. Then generate all files one by one.
4. Explain every folder.
5. Explain every important file.
6. Generate production-ready code.
7. Do not skip any file.
8. Do not use placeholder text.
9. Make the project ready to run immediately after Firebase configuration.
