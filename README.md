# Hospitality Portfolio CMS

A complete React + TypeScript + Tailwind CSS + Supabase portfolio website with a CMS-style admin dashboard for a Hospitality Instructor, Trainer, Educator, Consultant, and Academic Professional.

## What is included

- Public portfolio website with sections for Home, About, Experience, Education, Skills, Certifications, Teaching Portfolio, Projects, Consultancy Work, Gallery, Testimonials, and Contact.
- Admin login page from the website header.
- Secure authentication with Supabase Auth. The password is never stored in the React code.
- CMS dashboard with CRUD management for every portfolio section.
- File upload support through Supabase Storage buckets.
- Website Settings panel for branding, colors, typography, layout, images, SEO, and social links.
- Dark mode and light mode.
- Contact form connected to Supabase.
- WhatsApp floating button, back-to-top button, QR placeholder, PWA manifest, lazy image loading, loading states, and error handling.
- SQL database schema and sample data seeder.
- Vercel deployment guide and Supabase setup guide.

## Folder structure

```text
hospitality-portfolio-cms/
├─ public/
│  ├─ favicon.svg
│  ├─ manifest.webmanifest
│  ├─ pwa-192.svg
│  ├─ pwa-512.svg
│  └─ qr-placeholder.svg
├─ src/
│  ├─ admin/
│  │  ├─ config.ts
│  │  ├─ GenericManager.tsx
│  │  ├─ MessagesManager.tsx
│  │  └─ SettingsManager.tsx
│  ├─ components/
│  │  ├─ Layout.tsx
│  │  └─ ui.tsx
│  ├─ context/
│  │  ├─ AuthContext.tsx
│  │  └─ SettingsContext.tsx
│  ├─ data/
│  │  └─ demo.ts
│  ├─ lib/
│  │  ├─ seo.ts
│  │  └─ supabase.ts
│  ├─ pages/
│  │  ├─ AdminDashboard.tsx
│  │  ├─ AdminLogin.tsx
│  │  └─ PortfolioPage.tsx
│  ├─ types/
│  │  └─ content.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ supabase/
│  ├─ schema.sql
│  └─ seed.sql
├─ .env.example
├─ package.json
├─ tailwind.config.ts
├─ tsconfig.json
└─ vite.config.ts
```

## Local installation

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite.

The website can run in demo mode before Supabase is configured, but the admin dashboard and file uploads require Supabase.

## Supabase setup guide

1. Create a new Supabase project.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql`.
5. Go to **Authentication → Users → Add user**.
6. Create your admin email and password.
7. Copy the created user ID.
8. Run this SQL, replacing the values:

```sql
insert into public.admin_users (username, email, auth_user_id)
values ('admin', 'your-admin-email@example.com', 'PASTE_AUTH_USER_ID_HERE');
```

Now the login page accepts either:

- username: `admin`
- or the real admin email

The password is the Supabase Auth password you created.

## Environment variables

Create `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

You can find these in **Supabase → Project Settings → API**.

## Database design

Main content tables:

- `home_profiles`
- `about_sections`
- `experiences`
- `education`
- `skills`
- `certifications`
- `teaching_materials`
- `projects`
- `consultancy_projects`
- `gallery_items`
- `testimonials`
- `contact_info`
- `contact_messages`
- `site_settings`
- `admin_users`

Storage buckets:

- `portfolio-assets`
- `documents`
- `certificates`
- `gallery`

Security model:

- Public users can read portfolio content.
- Public users can submit contact messages.
- Only authenticated users listed in `admin_users` can create, update, and delete content.
- Supabase Auth manages passwords.

## Admin dashboard features

Inside `/admin`, the dashboard supports:

- Home management
- About management
- Experience management
- Education management
- Skills management with percentages
- Certifications with PDF/image uploads
- Teaching portfolio with document uploads
- Projects with image/document uploads
- Consultancy work with report/image uploads
- Gallery image management with categories and sort order
- Testimonial management
- Contact information management
- Contact message review
- Website settings for branding, typography, colors, layout, images, SEO, and social links

## Vercel deployment guide

1. Push this project to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Set framework preset to **Vite**.
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**.
7. After deployment, open the live URL and test:
   - public website
   - `/admin/login`
   - dashboard CRUD
   - file upload
   - contact form

## Customization notes

Most visual changes should be made from **Admin → Website Settings**.

For example:

- Change `primaryColor` to update the brand color.
- Change `fontFamily` to update typography.
- Change `sectionSpacing` to make the site more compact or spacious.
- Upload logo, favicon, profile image, banners, certificates, documents, and gallery items.

## Production hardening checklist

Before giving the site to a real client:

- Replace all demo text and demo images.
- Use a strong admin password.
- Enable email confirmation or MFA in Supabase Auth if required.
- Keep document buckets public only if files are intended to be public.
- Use private buckets and signed URLs for sensitive PDFs.
- Add a custom domain in Vercel.
- Add analytics provider script if required.
- Review SEO metadata in Admin Settings.

## Important security note

This project does not store admin passwords in the frontend or database tables. The admin password is handled by Supabase Auth. The `admin_users` table only maps a username/email to an authenticated Supabase user ID so the app can check whether the logged-in user is allowed to manage the CMS.
