-- Demo data seeder. Run after schema.sql.

insert into public.site_settings (key, value) values
('branding', '{"websiteName":"Dr. Amina Rahman Portfolio","logoUrl":"/favicon.svg","faviconUrl":"/favicon.svg","footerText":"© 2026 Dr. Amina Rahman. Hospitality education, training, and consulting."}'),
('typography', '{"fontFamily":"Inter","fontSize":"16px","headingFontWeight":800,"paragraphFontWeight":400}'),
('colors', '{"primaryColor":"#0f766e","secondaryColor":"#0f172a","accentColor":"#f59e0b","backgroundColor":"#f8fafc","textColor":"#0f172a","buttonColor":"#0f766e","navigationColor":"rgba(255,255,255,.88)"}'),
('layout', '{"sectionSpacing":"5rem","containerWidth":"1160px","borderRadius":"1.25rem","cardStyle":"soft-elevated","shadowStyle":"0 20px 45px rgba(15,23,42,.08)"}'),
('images', '{"heroImageUrl":"https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80","profileImageUrl":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80","backgroundImageUrl":"","bannerImageUrl":"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"}'),
('seo', '{"metaTitle":"Hospitality Instructor, Trainer & Consultant Portfolio","metaDescription":"Professional portfolio for a hospitality instructor, trainer, educator, consultant, and academic professional.","keywords":"hospitality instructor, hospitality consultant, trainer, educator, academic professional","ogTitle":"Hospitality Professional Portfolio","ogDescription":"Explore qualifications, teaching portfolio, consultancy work, certifications, and achievements."}'),
('social', '{"linkedin":"https://linkedin.com","facebook":"https://facebook.com","instagram":"https://instagram.com","youtube":"https://youtube.com","github":"https://github.com","whatsapp":"https://wa.me/0000000000"}')
on conflict (key) do update set value = excluded.value;

insert into public.home_profiles (name, professional_title, hero_text, profile_image_url, resume_url, qr_code_url, social_links, achievements, stats) values (
'Dr. Amina Rahman',
'Hospitality Instructor | Trainer | Consultant | Academic Professional',
'I help hospitality institutions, learners, and service teams build world-class guest experience, operational excellence, and career-ready skills through evidence-based training and academic leadership.',
'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
'#',
'/qr-placeholder.svg',
'{"linkedin":"https://linkedin.com","facebook":"https://facebook.com","instagram":"https://instagram.com","youtube":"https://youtube.com","github":"https://github.com","whatsapp":"https://wa.me/0000000000"}',
'["15+ years in hospitality education and industry training","Designed 40+ training modules for hotels, colleges, and service teams","Consulted on guest experience, SOP design, and service quality audits"]',
'[{"label":"Learners Trained","value":"4,500+"},{"label":"Academic Courses","value":"28"},{"label":"Consultancy Projects","value":"35+"},{"label":"Certifications","value":"18"}]'
);

insert into public.about_sections (title, body, sort_order) values
('Professional Summary', 'Hospitality educator and consultant with experience across hotel operations, front office systems, food and beverage service, guest relations, academic curriculum design, and professional training.', 1),
('Teaching Philosophy', 'My teaching approach connects real hotel scenarios with practical classroom activities, role-play, assessment rubrics, and reflective learning so learners can confidently apply theory in service environments.', 2);

insert into public.experiences (role, organization, location, start_date, end_date, description, sort_order) values
('Senior Hospitality Instructor', 'International College of Tourism & Hospitality', 'Dubai, UAE', '2018-01-01', null, 'Lead diploma and professional training courses in hotel operations, guest service, front office, and service quality management.', 1),
('Training Consultant', 'Premier Guest Experience Advisory', 'Remote / On-site', '2015-03-01', '2017-12-31', 'Delivered training needs analysis, SOP improvement, mystery guest audits, and staff development programs for hospitality clients.', 2);

insert into public.education (degree, institution, location, year, description, sort_order) values
('PhD in Hospitality Management', 'Global School of Business & Tourism', 'Malaysia', '2016', 'Research focus: service quality, guest satisfaction, and hospitality workforce development.', 1),
('MSc Tourism and Hotel Management', 'University of Applied Hospitality Sciences', 'UK', '2010', 'Specialized in hotel operations, tourism strategy, and customer experience.', 2);

insert into public.skills (name, category, percentage, sort_order) values
('Hospitality Training', 'Teaching', 96, 1),
('Curriculum Design', 'Academic', 92, 2),
('Guest Experience Audits', 'Consultancy', 90, 3),
('Food & Beverage Service', 'Operations', 88, 4),
('Front Office Operations', 'Operations', 91, 5);

insert into public.certifications (title, issuer, issue_date, certificate_url, image_url, description, sort_order) values
('Certified Hospitality Trainer', 'Hospitality Training Institute', '2022-05-10', '#', '', 'Professional certification in adult learning and hospitality training delivery.', 1),
('Food Safety Level 3', 'International Food Safety Council', '2021-09-15', '#', '', 'Advanced food safety, hygiene management, and compliance training.', 2);

insert into public.teaching_materials (title, course, material_type, document_url, description, sort_order) values
('Front Office Role-Play Toolkit', 'Front Office Operations', 'Lesson Plan', '#', 'Practical role-play scenarios for reservation, check-in, complaint handling, and upselling.', 1),
('Service Quality Rubric', 'Guest Relations', 'Assessment Rubric', '#', 'Rubric for evaluating service language, empathy, problem solving, and professional conduct.', 2);

insert into public.projects (title, client_or_context, project_date, image_url, document_url, description, sort_order) values
('Hospitality Career Readiness Program', 'College Employability Office', '2024-08-01', 'https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=800&q=80', '#', 'Designed a career-readiness program covering service etiquette, CV preparation, interview simulations, and workplace expectations.', 1),
('Academic Quality Enhancement Initiative', 'Hospitality Department', '2023-11-01', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80', '#', 'Improved course mapping, learning outcomes, assessment design, and student feedback processes.', 2);

insert into public.consultancy_projects (title, client, consultancy_date, report_url, image_url, description, sort_order) values
('Hotel Service Excellence Audit', 'Boutique Hotel Group', '2024-04-01', '#', '', 'Conducted staff observation, guest journey mapping, SOP review, and action plan development.', 1),
('Restaurant Staff Upskilling Workshop', 'Fine Dining Restaurant', '2023-06-01', '#', '', 'Delivered customized training for service sequence, menu knowledge, guest recovery, and team communication.', 2);

insert into public.gallery_items (title, category, image_url, sort_order) values
('Training Workshop', 'Training', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80', 1),
('Hospitality Classroom', 'Teaching', 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80', 2),
('Consultancy Session', 'Consultancy', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', 3);

insert into public.testimonials (name, role, quote, image_url, sort_order) values
('Michael Anderson', 'Hotel General Manager', 'Amina transformed our service training into a practical, measurable, and motivating program for the team.', '', 1),
('Sara Khan', 'Hospitality Graduate', 'Her classes made hotel operations easy to understand because every lesson connected to real guest situations.', '', 2);

insert into public.contact_info (phone, email, website_url, office_address, social_links) values
('+971 00 000 0000', 'amina.rahman@example.com', 'https://example.com', 'Hospitality Training Centre, Academic City', '{"linkedin":"https://linkedin.com","facebook":"https://facebook.com","instagram":"https://instagram.com","youtube":"https://youtube.com","github":"https://github.com","whatsapp":"https://wa.me/0000000000"}');
