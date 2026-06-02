# Deployment Guide

## Local test

```bash
npm install
cp .env.example .env
npm run dev
```

Add your Supabase values to `.env` before testing admin CRUD and uploads.

## Production build

```bash
npm run build
npm run preview
```

## Vercel deployment

1. Push the project to GitHub.
2. Open Vercel and import the repository.
3. Use framework preset: **Vite**.
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.
6. Open `/admin/login` and test:
   - login
   - edit home profile
   - add a skill
   - upload a certificate
   - send a contact message

## Recommended production checklist

- Replace demo images and demo content.
- Use a strong admin password.
- Enable MFA in Supabase Auth if required.
- Connect a custom domain in Vercel.
- Verify SEO title, description, keywords, and Open Graph content in Admin → Website Settings.
- Review whether document buckets should be public or private.
- Add analytics provider snippet if needed.
