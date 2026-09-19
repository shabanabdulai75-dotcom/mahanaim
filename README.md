# Mahanaim Academy School Management System

Blue-and-white school management system for **Mahanaim Academy (Camp OG God)**, Sagnerigu Kukuo, Tamale.

## Run locally

```bash
npm start
```

Then open `http://localhost:4173`.

Run the smoke test while the server is running:

```bash
npm test
```

The app uses a Node server and stores data in `data.json` by default, or PostgreSQL when `DATABASE_URL` is configured. The browser interface also keeps a local copy for offline-friendly use and supports CSV imports plus JSON backup/restore from **Users & access**.

## Included modules

- Dashboard and public school website
- Students and staff/teachers
- GES/NaCCA curriculum catalogue
- Attendance, finance and fees
- Assessments and report cards
- Timetable management
- Parent portal
- Admissions, class promotion, discipline/welfare, inventory/library
- Communications and announcements
- Users, sign-in and role access workflow
- JSON backup/restore and API health endpoint

## API endpoints

- `GET /api/health`
- `GET /api/data`
- `PUT /api/data`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/auth/users` (administrator only)
- `POST /api/auth/users` (administrator only)
- `POST /api/notifications/test` (administrator only)

For a production deployment, replace the JSON store with PostgreSQL or MySQL, store secrets in environment variables, use HTTPS, add rate limiting, and use a managed email/SMS provider.

## Docker

```bash
docker build -t mahanaim-academy .
docker run --rm -p 4173:4173 -e DEMO_ADMIN_PASSWORD='change-this-password' mahanaim-academy
```

## Deploy on Koyeb

See `KOYEB_DEPLOY.md`. Koyeb can deploy this Node application from the existing GitHub repository, while Neon or Supabase can provide PostgreSQL storage.

## Deploy on Render

1. Create a new **Web Service** on Render and connect the GitHub repository containing this project, or upload the project through your preferred repository workflow.
2. Render can use `render.yaml` to configure the service automatically.
3. Set `DEMO_ADMIN_PASSWORD` in the Render Environment settings to a strong private password.
4. For PostgreSQL, set `DATABASE_URL` and `DATABASE_SSL=true` in Render Environment settings.
5. For messaging, set `SMS_PROVIDER_URL`, `SMS_PROVIDER_TOKEN`, `EMAIL_API_URL`, `EMAIL_API_TOKEN` and `SCHOOL_FROM_EMAIL`.
6. Deploy and confirm the health URL: `/api/health`.

The included `render.yaml` uses Render's Free web service for a no-payment preview. Free services sleep after inactivity and their local data is temporary. For persistent school records, use `render-production.yaml`, which attaches a paid persistent disk.

## Demo administrator sign-in

The server accepts the demo administrator account when no users have been created:

- Email: `admin@mahanaim.edu.gh`
- Password: `Mahanaim@2026`

Change this before production by setting `DEMO_ADMIN_PASSWORD` or replacing the starter user flow with your production identity provider.
