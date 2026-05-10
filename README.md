# HustleBuddy

A comprehensive application tracking and AI-driven proposal generation platform designed to streamline the internship acquisition process. HustleBuddy consolidates the workflow of managing applications across disparate job boards (Internshala, LinkedIn, Unstop, and others) into a single, centralized dashboard.

#### Development Status Notice: 
This project is currently in the active build phase. The codebase is a work in progress and is not yet ready for production deployment or general public use. Core features are still being implemented and tested.


## Table of Contents

1. [System Overview](https://www.google.com/search?q=%23system-overview)
2. [Core Architecture & Features](https://www.google.com/search?q=%23core-architecture--features)
3. [Technology Stack](https://www.google.com/search?q=%23technology-stack)
4. [Strategic AI Integration](https://www.google.com/search?q=%23strategic-ai-integration)
5. [Local Development Setup](https://www.google.com/search?q=%23local-development-setup)
6. [Development Roadmap](https://www.google.com/search?q=%23development-roadmap)

## System Overview

Job seekers currently suffer from fragmented workflows, tracking applications in static spreadsheets while manually drafting repetitive cover letters. HustleBuddy solves this by unifying application state management, job discovery, and automated proposal generation into a single full-stack application.

## Core Architecture & Features

### 1. Application State Management

* **Kanban-Style Tracking:** Users can log and transition applications through predefined states (Applied, Interviewing, Offered, Rejected).
* **Analytics & Search:** Built-in telemetry allows users to view application statistics, filter by status, and search historical logs.

### 2. Unified Discovery Feed

* **Aggregated Job Board:** A centralized feed that surfaces internships from multiple external platforms.
* **Granular Filtering:** Users can filter roles based on stipend parameters, geographic location, and target companies.

### 3. AI Proposal Engine

* **Context-Aware Drafting:** Users input a job description, and the system synthesizes a highly tailored application proposal.
* **Localized LLM:** Powered by the Sarvam Arya API, ensuring the generated text aligns with regional professional standards.

### 4. Authentication & Security

* **JWT Implementation:** Secure, token-based authentication system handling user registration, login, and session persistence across protected routes.

## Technology Stack

| Component | Technology |
| --- | --- |
| **Frontend Framework** | React 18, Vite |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS |
| **Backend Runtime** | Node.js, Express.js |
| **Database** | PostgreSQL (Hosted via Supabase) |
| **Authentication** | JSON Web Tokens (JWT) |
| **AI Infrastructure** | Sarvam Arya API |
| **Deployment Infrastructure** | Vercel (Frontend), Render (Backend) |

## Strategic AI Integration

A core differentiator of this platform is the deliberate selection of the Sarvam Arya model over standard global LLMs (such as GPT-4 or Claude). Global models frequently generate Americanized professional text that can appear synthetic or culturally misaligned to recruiters in the Indian tech sector. By utilizing a model explicitly trained on Indian English nuances, HustleBuddy generates proposals that remain professional while feeling authentic and natively written.

## Local Development Setup

Follow these instructions to configure the development environment on your local machine.

### Prerequisites

* Node.js (v18.0.0 or higher)
* PostgreSQL database instance (or Supabase project)
* Sarvam AI API Key

### Backend Configuration

1. Navigate to the backend directory:
```bash
cd backend

```


2. Install dependencies:
```bash
npm install

```


3. Configure environment variables:
```bash
cp .env.example .env

```


Open the `.env` file and populate the following required variables:
* `DATABASE_URL`
* `JWT_SECRET`
* `SARVAM_API_KEY`


4. Initialize the development server:
```bash
npm run dev

```



### Frontend Configuration

1. Open a new terminal session and navigate to the frontend directory:
```bash
cd frontend

```


2. Install dependencies:
```bash
npm install

```


3. Configure environment variables:
```bash
cp .env.example .env

```


Open the `.env` file and ensure it points to your local backend instance:
* `VITE_API_BASE_URL=http://localhost:3000`


4. Initialize the frontend development server:
```bash
npm run dev

```



## Development Roadmap

The platform is actively being extended to include autonomous agent capabilities and browser-level integrations.

* **Browser Extension Architecture (Manifest V3):** A Chrome extension designed to auto-detect job postings on LinkedIn and Indeed, enabling one-click application logging to the user dashboard.
* **Resume Parser & Scoring Engine:** A PDF upload pipeline that provides automated feedback scoring and ATS (Applicant Tracking System) optimization recommendations.
* **Community Intelligence Vault:** A collaborative database where users can share successful application strategies and technical interview experiences.
* **Automated Scouting Agent:** A background worker process that matches user profiles with newly posted roles across platforms.
* **Autonomous Apply Agent:** Direct integration with the browser extension to map user vault data to HTML form fields, enabling one-click autofill and submission capabilities.
