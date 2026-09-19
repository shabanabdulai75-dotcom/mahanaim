# Deploy Mahanaim Academy on Koyeb

Koyeb can run the Node server from the GitHub repository without using Render.

## Steps

1. Open the Koyeb dashboard and create an App.
2. Choose **GitHub** as the deployment source.
3. Select `shabanabdulai75-dotcom/mahanaim` and branch `main`.
4. Select the Node.js build or Dockerfile deployment.
5. Use:
   - Build command: `npm install`
   - Run command: `npm start`
   - Health check: `/api/health`
6. Choose the Free instance for a preview, if available in your account and region.
7. Add environment variables:
   - `DEMO_ADMIN_PASSWORD`
   - `DATABASE_URL`
   - `DATABASE_SSL=true`
   - `SMS_PROVIDER_URL`
   - `SMS_PROVIDER_TOKEN`
   - `EMAIL_API_URL`
   - `EMAIL_API_TOKEN`
   - `SCHOOL_FROM_EMAIL`
8. Deploy and open the Koyeb URL.

For persistent school records, use Neon or Supabase PostgreSQL and set `DATABASE_URL`. The application automatically uses PostgreSQL when that variable is present; otherwise it falls back to JSON storage.

Test the deployment at:

`https://your-koyeb-url/api/health`
