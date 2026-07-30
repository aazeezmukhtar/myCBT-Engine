# EduPulse CBT & Learning Analytics Platform

A production-ready, mobile-first **Computer-Based Testing and Learning Analytics Platform** for schools.

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Vanilla CSS with design tokens (light/dark mode)
- **Database**: Supabase (PostgreSQL) — with localStorage fallback for local dev
- **Hosting**: Vercel (frontend)
- **Charts**: Chart.js + react-chartjs-2
- **Reports**: jsPDF + XLSX
- **Icons**: Lucide React

## Features

- 🔐 Role-based authentication (Admin / Student)
- 📝 Full CBT exam engine with timer, flag, auto-save
- 📊 Deep learning analytics & topic mastery reports
- 🔄 Multi-attempt averaged scoring system
- 📥 Excel import for students and questions
- 📄 PDF & Excel report generation
- ⚙️ Subject & topic management
- 🌙 Dark / Light theme

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/noble-borg-cbt-platform.git
cd noble-borg-cbt-platform
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

> **Note**: If you skip this step, the app runs in **localStorage mode** (single-browser, no persistence across devices).

### 3. Set Up Supabase Database

1. Create a project at [supabase.com](https://supabase.com)
2. In the Supabase SQL Editor, run: `supabase/schema.sql`
3. This creates all tables, RLS policies, and seeds initial data

### 4. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

### 5. Demo Credentials

| Role | Credential |
|------|-----------|
| **Student** | `STU-2026-001` (Amina Yusuf) |
| **Student** | `STU-2026-002` (Emeka Okafor) |
| **Administrator** | Any password (demo mode) |

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Git Repository
3. Select this repo — Vercel auto-detects Vite
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click Deploy ✅

Every `git push main` auto-deploys to production.

## Project Structure

```
noble-borg/
├── src/
│   ├── App.jsx                    # Root with async data loading
│   ├── context/                   # Auth + Theme context
│   ├── services/
│   │   ├── supabaseClient.js      # Supabase client (NEW)
│   │   ├── storageService.js      # Async hybrid storage
│   │   ├── analyticsService.js    # Scoring & analytics engine
│   │   ├── excelService.js        # XLSX export
│   │   └── pdfService.js          # PDF report generation
│   ├── components/
│   │   ├── common/                # Login, Header, Nav, Notifications
│   │   ├── admin/                 # Dashboard, Students, Questions, Assessments, Analytics, Reports, Settings
│   │   └── student/               # Dashboard, Exam Engine, Results, Analytics
│   └── styles/                    # Design tokens + component CSS
├── supabase/
│   └── schema.sql                 # Full PostgreSQL schema + RLS
├── .env.local.example             # Env template
└── README.md
```

## License

MIT — Noble Borg International Academy
