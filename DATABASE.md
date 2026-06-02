# Database Schema Summary

## Authentication

Supabase Auth stores the admin email and password. The app table `admin_users` maps an admin username to a Supabase Auth user ID.

## Tables

- `admin_users`: admin username/email/auth user mapping
- `site_settings`: branding, typography, colors, layout, images, SEO, social media
- `home_profiles`: hero profile, CV, QR, social links, achievements, stats
- `about_sections`: about content blocks
- `experiences`: professional experience
- `education`: education records
- `skills`: skills with percentages
- `certifications`: certificate records and PDF/image URLs
- `teaching_materials`: lesson plans, teaching documents, and academic resources
- `projects`: projects and achievements
- `consultancy_projects`: consultancy work and reports
- `gallery_items`: gallery images with categories and order
- `testimonials`: testimonials
- `contact_info`: public contact details
- `contact_messages`: messages submitted from contact form

## Storage buckets

- `portfolio-assets`: logos, profile images, project images, banners
- `documents`: CVs, lesson plans, reports, project files
- `certificates`: certificate PDFs and images
- `gallery`: public gallery images

## RLS policy summary

- Public visitors can read portfolio content.
- Public visitors can insert contact messages.
- Only authenticated users listed in `admin_users` can create, update, or delete CMS content.
- Storage uploads, updates, and deletes are restricted to admins.
