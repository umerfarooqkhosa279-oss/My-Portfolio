# Supabase Setup Guide

## 1. Create project

Create a new Supabase project and wait until the database is ready.

## 2. Run database schema

Open **SQL Editor** and run:

```sql
-- paste contents of supabase/schema.sql
```

This creates all tables, row-level-security policies, storage buckets, admin helper function, and contact-message permissions.

## 3. Seed demo content

Run:

```sql
-- paste contents of supabase/seed.sql
```

This fills the portfolio with professional demo content so the website looks complete immediately.

## 4. Create admin account

Go to **Authentication → Users → Add user** and create a user with your real admin email and a strong password.

Then copy the created user ID and run:

```sql
insert into public.admin_users (username, email, auth_user_id)
values ('admin', 'your-admin-email@example.com', 'PASTE_AUTH_USER_ID_HERE');
```

The admin login page accepts either the username or email. Supabase Auth verifies the password.

## 5. Get environment variables

Go to **Project Settings → API** and copy:

- Project URL
- anon public key

Add them to `.env` locally or Vercel environment variables.

## 6. Storage

The schema creates these buckets:

- `portfolio-assets`
- `documents`
- `certificates`
- `gallery`

They are public by default because this portfolio is designed to show public CV, certificates, gallery images, and teaching documents. For private documents, make the bucket private and implement signed URLs.
