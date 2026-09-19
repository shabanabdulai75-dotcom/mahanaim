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

The app uses a dependency-free Node server and stores the starter database in `data.json`. The browser interface also keeps a local copy for offline-friendly use and supports CSV imports plus JSON backup/restore from **Users & access**.

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

For a production deployment, replace the JSON store with PostgreSQL or MySQL, store secrets in environment variables, use HTTPS, add rate limiting, and use a managed email/SMS provider.

## Docker

```bash
docker build -t mahanaim-academy .
docker run --rm -p 4173:4173 -e DEMO_ADMIN_PASSWORD='change-this-password' mahanaim-academy
```

## Deploy on Render

1. Create a new **Web Service** on Render and connect the GitHub repository containing this project, or upload the project through your preferred repository workflow.
2. Render can use `render.yaml` to configure the service automatically.
3. Set `DEMO_ADMIN_PASSWORD` in the Render Environment settings to a strong private password.
4. Keep the included persistent disk mounted at `/var/data`; the server stores `data.json` there.
5. Deploy and confirm the health URL: `/api/health`.

The included Render configuration uses a Starter web service because persistent disks are required to keep school records after redeploys. If you use a free preview service, treat the JSON data as temporary.

## Demo administrator sign-in

The server accepts the demo administrator account when no users have been created:

- Email: `admin@mahanaim.edu.gh`
- Password: `Mahanaim@2026`

Change this before production by setting `DEMO_ADMIN_PASSWORD` or replacing the starter user flow with your production identity provider.
