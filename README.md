# WashConnect

A MERN-stack marketplace connecting customers with local Laundry Service
Providers (LSPs). Customers can find verified providers near them, see
live pricing, and place bookings; LSPs manage their shop profile, pricing,
availability, and incoming bookings; admins verify LSPs and manage the
platform's reference data (states, locations, service catalog).

## Tech stack

- **Backend:** Node.js, Express 4, MongoDB/Mongoose, JWT (httpOnly cookie
  auth), Multer for uploads
- **Frontend:** React 19, Vite, Redux Toolkit + RTK Query, React Router 6,
  Tailwind CSS

## Project structure

```
washapp/
├── backend/     Express API (ESM, "type": "module")
└── frontend/    Vite + React app
```

## Prerequisites

- Node.js 18+ and npm
- A MongoDB database (a free [MongoDB Atlas](https://www.mongodb.com/atlas)
  cluster works fine, or a local `mongod`)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string

The app is unusable with a totally empty database (no states/locations
means no one can register an LSP or search for one, and there's no way to
create an admin account through the public UI by design — see
**Security note** below). Seed baseline data and your first admin account:

```bash
npm run seed            # states, locations, and a starter service catalog
npm run seed:admin      # also creates an admin user from ADMIN_EMAIL / ADMIN_PASSWORD in .env
```

Then start the API:

```bash
npm run dev     # nodemon, auto-restarts on change
# or
npm start       # plain node
```

The API runs at `http://localhost:5000` by default (`PORT` in `.env`).

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. In development, Vite proxies
`/api` and `/uploads` requests to `http://localhost:5000` (see
`vite.config.js`), so both servers just need to be running side by side —
no CORS setup needed for local dev.

### 3. Log in

- Register as a **customer** or **laundry service provider** from the
  Register page.
- LSP accounts are redirected to their profile setup page after signup;
  fill it in and it goes to `pending` state until an admin verifies it
  (`/admin/lsps/pending`).
- Log in as the admin account created by `npm run seed:admin` to verify
  LSPs and manage the platform.

## Running tests

```bash
cd backend
npm test
```

This runs Node's built-in test runner (`node --test`) against
`backend/tests/`. One suite (`userModel.test.js`) spins up an in-memory
MongoDB via `mongodb-memory-server`, which downloads a MongoDB binary the
first time it runs — this needs a normal internet connection but no local
MongoDB install.

There's no frontend test suite yet; `npm run lint` (in `frontend/`) is
available for static checks.

## Security note: admin accounts

The public registration endpoint only ever creates `customer` or `lsp`
accounts — it will not honor a client-supplied `role: "admin"`. Admin
accounts must be created with `npm run seed:admin` (or directly in the
database). This is deliberate: allowing self-service admin signup would be
a privilege-escalation hole.

## Known limitations / good next steps

- Payments are cash-only for now (`payment.method` is recorded but there's
  no payment gateway integration).
- Email/SMS notification delivery (`SMTP_*` env vars) isn't wired up to an
  actual send yet — notifications are currently persisted in-app only
  (`Notification` model), not sent externally.
- The notifications and reviews APIs (`/api/notifications`, `/api/reviews`)
  are fully implemented on the backend but have no frontend UI yet (no
  notification bell/dropdown, no review submission or display).
- The "favorites" Redux slice exists but isn't connected to any UI.
- No automated frontend tests yet.

## API overview

All endpoints are mounted under `/api`:

| Path                 | Purpose                                    |
|-----------------------|---------------------------------------------|
| `/api/users`          | register, login, logout, profile           |
| `/api/lsps`            | LSP directory, own-profile management       |
| `/api/service-catalog` | service categories (admin-managed)         |
| `/api/locations`       | states & locations (admin-managed)         |
| `/api/bookings`        | create/accept/decline/complete/cancel      |
| `/api/notifications`   | in-app notifications                       |
| `/api/reviews`         | LSP reviews                                |
| `/api/upload`          | image/document uploads                     |
| `/api/admin`           | metrics, user/LSP/booking management       |

Auth uses an httpOnly `jwt` cookie set on login/register — the frontend's
`fetchBaseQuery` is configured with `credentials: 'include'` to send it
automatically.
