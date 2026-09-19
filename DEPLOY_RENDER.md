# Deploy Mahanaim Academy on Render

## Recommended route: Render Blueprint

1. Create a private GitHub repository called `mahanaim-academy`.
2. Upload the contents of this project, including `render.yaml`.
3. On Render, choose **New + → Blueprint** and connect the GitHub repository.
4. Confirm the service name `mahanaim-academy`.
5. In Environment, set `DEMO_ADMIN_PASSWORD` to a strong password that is not shared publicly.
6. If using Neon or Supabase, set `DATABASE_URL` and `DATABASE_SSL=true`.
7. Set messaging provider variables only after creating SMS/email accounts.
8. Deploy.
9. Open the generated Render URL and test:
   - `/api/health`
   - School sign-in
   - Users & access
   - CSV import
   - Backup and restore

The default `render.yaml` uses Render's Free web service, so no payment is required for a preview deployment. Free services sleep after inactivity and local `data.json` storage is temporary.

For persistent school records, use `render-production.yaml` instead. It mounts a 1 GB persistent disk at `/var/data` and uses the paid Starter plan.

## Important

- Free Render is suitable for preview/testing, not permanent records.
- The demo JSON storage is suitable for a pilot, not a multi-school production system.
- For production, migrate records to PostgreSQL, enable HTTPS, rotate the admin password, add rate limiting and configure a real SMS/email provider.
