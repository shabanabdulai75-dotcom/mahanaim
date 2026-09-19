# Deploy Mahanaim Academy on Render

## Recommended route: Render Blueprint

1. Create a private GitHub repository called `mahanaim-academy`.
2. Upload the contents of this project, including `render.yaml`.
3. On Render, choose **New + → Blueprint** and connect the GitHub repository.
4. Confirm the service name `mahanaim-academy`.
5. In Environment, set `DEMO_ADMIN_PASSWORD` to a strong password that is not shared publicly.
6. Deploy.
7. Open the generated Render URL and test:
   - `/api/health`
   - School sign-in
   - Users & access
   - CSV import
   - Backup and restore

The Render configuration mounts a 1 GB persistent disk at `/var/data`, and the server uses `DATA_DIR=/var/data` so `data.json` survives redeploys.

## Important

- Render Starter is used because persistent disks are needed for school records.
- The demo JSON storage is suitable for a pilot, not a multi-school production system.
- For production, migrate records to PostgreSQL, enable HTTPS, rotate the admin password, add rate limiting and configure a real SMS/email provider.
