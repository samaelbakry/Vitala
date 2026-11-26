# Vitala

Vitala is a multi-clinic healthcare management web application built with React and Supabase. It provides an authenticated workspace for clinic administrators, doctors, and receptionists, with role-aware navigation, clinic switching, patient records, and staff invitations.

## Features

- Email and password authentication with Supabase Auth
- Multi-clinic memberships and active-clinic switching
- Role-based access for:
  - `admin`
  - `doctor`
  - `receptionist`
- Clinic onboarding and profile settings
- Patient directory with:
  - Search
  - Patient creation
  - Contact, demographic, and clinical note fields
- Staff invitations with secure, expiring tokens
- Protected, public, membership, and role-based routes
- Responsive layout with collapsible navigation
- Light and dark themes
- React Query caching and loading/error states
- Supabase Edge Functions for staff workflows

## Implemented Product Areas

| Area | Status |
| --- | --- |
| Authentication | Implemented |
| Clinic creation and switching | Implemented |
| Clinic settings | Implemented |
| Patients | Implemented |
| Staff invitations | Implemented |
| Dashboard | Implemented with summary placeholders |
| Appointments | Route scaffold |
| Doctors | Route scaffold |
| Medical records | Route scaffold |
| Prescriptions | Route scaffold |
| Reports | No route currently implemented |
| Notifications | No route currently implemented |

The dashboard’s displayed totals are currently placeholder values and the appointments, doctors, medical records, and prescriptions pages are accessible route shells where applicable.

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Routing:** React Router 7
- **State management:** Redux Toolkit
- **Server state:** TanStack React Query
- **Backend:** Supabase Auth, Postgres, RPCs, and Edge Functions
- **Forms:** React Hook Form and Zod
- **UI:** Tailwind CSS 4, Base UI, and Lucide React
- **Notifications:** Sonner

## Project Structure

```text
src/
  app/                Application providers, router, and Redux store
  assets/             Static image assets
  components/         Shared UI and layout components
  constants/          Application navigation configuration
  features/
    appointments/     Appointment feature area
    auth/             Authentication and session management
    clinic/           Clinic and membership management
    dashboard/        Main dashboard
    doctors/          Doctor feature area
    layout/           Authentication and application layouts
    medical-records/  Medical records feature area
    notifications/    Notification feature area
    patients/         Patient directory and patient creation
    prescriptions/    Prescription feature area
    reports/          Reporting feature area
    routes/           Route and role guards
    staff/            Staff and invitation management
  lib/                Supabase and shared utilities
  services/           Shared API integrations
  types/              Shared TypeScript types
  utils/              Shared helpers
supabase/
  config.toml         Supabase project configuration
  functions/          Supabase Edge Functions
```

## Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project
- Supabase CLI, if you plan to deploy or serve Edge Functions locally

## Environment Configuration

Create a `.env` file in the project root:

```dotenv
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-publishable-or-anon-key>
```

The values are read by `src/lib/supabase.ts`. Do not use the Supabase service-role key in the frontend application.

The repository expects the following Supabase database objects:

- `clinics`
- `clinic_members`
- `clinic_invitations`
- `patients`
- `create_clinic` RPC

The repository does not currently contain Supabase database migrations. Provision these tables, relationships, policies, and the `create_clinic` RPC in your Supabase project before running the application. Configure Row Level Security (RLS) so users can only access active clinics and records they are authorized to manage.

## Installation

```bash
npm install
```

## Running the Application

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Supabase Edge Functions

The project includes two Edge Functions:

- `invite-staff` creates a secure, seven-day staff invitation and sends it by email
- `get-clinic-invitations` validates the current admin and lists non-sensitive invitation data

Deploy or serve the functions with the Supabase CLI:

```bash
npx supabase functions deploy invite-staff
npx supabase functions deploy get-clinic-invitations
```

Configure these Edge Function secrets in Supabase:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
APP_URL
```

`APP_URL` should be the public base URL of the Vitala frontend. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side and never expose it in `.env` variables used by Vite.

If developing Edge Functions locally, configure Supabase secrets and start the local function server according to your Supabase CLI setup, then update the frontend invocation URLs if they point to a hosted project.

## Authentication and Authorization

The application initializes the Supabase session and stores the user and session in Redux. Route guards control access based on authentication, clinic membership, and role.

Supported active-clinic roles are:

- **Admin:** clinic management, staff, and settings
- **Doctor:** clinical routes and patient-related access
- **Receptionist:** operational routes and patient access

Protected database operations should also enforce permissions with Supabase RLS policies and RPC-level checks.

## Development Notes

- The `@` import alias resolves to `src/`
- Redux manages authentication, clinic state, sidebar state, and theme state
- React Query manages server state and caches clinic and patient queries
- The patient directory refreshes from Supabase and supports name search
- The sidebar and route availability react to the active clinic membership role
- React Query Devtools are enabled in development

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
