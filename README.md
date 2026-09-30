# MG Cleaning Services

Website and internal management platform for **MG Cleaning Services**, a residential cleaning business in Melbourne.

Live site: <https://www.mgcleaningservices.com.au>

The app has two sides:

- **Public website:** presents the business and its team, and lets customers request a cleaning online.
- **Admin panel:** lets the business manage requests, jobs, employees and candidates.

---

## Features

### Public

| Route              | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| `/`                | Landing page: services, team, how it works, gallery, service areas, quote |
| `/request-service` | Multi-step form for customers to request a cleaning                       |
| `/team/:slug`      | Public profile of a team member                                           |
| `/apply`           | Job application form for new cleaners (by invitation)                     |
| `/login`           | Staff login                                                               |

### Admin (`/admin`, `admin` role only)

- **Dashboard:** stats, recent requests, upcoming jobs and items needing attention
- **Requests:** review customer requests and convert them into jobs
- **Jobs:** create and schedule jobs, assign the team, add internal notes
- **Team:** manage employees, profiles, photos and availability
- **Candidates:** send invitations, review applications and approve new employees

---

## Tech Stack

| Area         | Tools                                                                   |
| ------------ | ----------------------------------------------------------------------- |
| Frontend     | React 18, Vite 6, React Router 6                                        |
| Styling / UI | Tailwind CSS 4, Radix UI (shadcn/ui), Lucide icons, Framer Motion       |
| Backend      | Supabase: PostgreSQL, Auth, Storage, Edge Functions, Row Level Security |
| Other        | Recharts, date-fns, Sonner, react-phone-number-input, vite-plugin-pwa   |
| Deployment   | Vercel                                                                  |
| Analytics    | Google Analytics 4 (public pages only)                                  |

---

## Getting Started

### Requirements

- Node.js 18 or newer
- npm
- Access to the project's Supabase instance

### Setup

```bash
git clone <repo-url>
cd MG-Services
npm install
```

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

> Use only the **publishable** (anon) key here. Never put the `service_role` key in the frontend: every `VITE_` variable is visible in the browser.

Start the development server:

```bash
npm run dev
```

The app runs at <http://localhost:5173>.

### Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the development server                 |
| `npm run build`     | Build for production into `dist/`            |
| `npm run preview`   | Serve the production build locally           |
| `npm run lint`      | Run ESLint                                   |
| `npm run lint:fix`  | Run ESLint and fix what it can automatically |
| `npm run typecheck` | Type-check the project with TypeScript       |

---

## Project Structure

```text
public/                 Static files (images, favicon, robots.txt, sitemap.xml)
src/
├── components/
│   ├── landing/        Sections of the public home page
│   ├── request-service/ Steps of the service request form
│   ├── employees/      Public team member cards
│   ├── admin/          Admin panel (dashboard, forms, jobs, team, navigation)
│   ├── auth/           ProtectedRoute (role-based access)
│   └── ui/             Base UI components (shadcn/ui)
├── hooks/              Page logic and data loading (useAdminJobs, useRequestService, ...)
├── services/           Supabase access, one file per domain (jobs, requests, employees, ...)
├── pages/              One component per route; admin/ for the panel
├── lib/                Supabase client, utilities, 404 page
├── App.jsx             Route definitions
└── main.jsx            Entry point
```

**Data flow:** `pages` → `hooks` → `services` → Supabase.
Components never call Supabase directly. All queries go through `services/`.

---

## Supabase

The app uses these Supabase features:

- **Auth:** staff login. The role is stored in the `profiles` table (`role = 'admin'`).
- **Database:** requests, jobs, employees, candidates, cleaning services and packages.
- **Storage:** employee and candidate photos.
- **RPC functions:** `create_candidate_invite`, `validate_candidate_invite`, `submit_candidate_application`.
- **Edge Functions:** `candidate-photo-upload`, `approve-candidate`.

> **Security:** `ProtectedRoute` only controls navigation in the browser. The real protection is **RLS**, so every table and bucket must have policies that restrict writes, and access to private data, to the `admin` role.

---

## Deployment

The project deploys automatically to **Vercel** on every push to `main`.

- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in _Vercel → Settings → Environment Variables_.
- `vercel.json` rewrites the SPA routes to `index.html`. **When you add a new public route, also add it to `vercel.json`** (and to `public/sitemap.xml` if it should be indexed).
- The app is a PWA (`vite-plugin-pwa`) and updates automatically.

---

## Roadmap

- Online booking and payments
- Customer reviews
- Advanced scheduling
- Business analytics
