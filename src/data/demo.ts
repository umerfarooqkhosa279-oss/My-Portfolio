export const defaultSettings = {
  branding: {
    websiteName: 'Dr. Amina Rahman Portfolio',
    logoUrl: '/favicon.svg',
    faviconUrl: '/favicon.svg',
    footerText: '© 2026 Dr. Amina Rahman. Hospitality education, training, and consulting.'
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: '16px',
    headingFontWeight: 800,
    paragraphFontWeight: 400
  },
  colors: {
    primaryColor: '#0f766e',
    secondaryColor: '#0f172a',
    accentColor: '#f59e0b',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    buttonColor: '#0f766e',
    navigationColor: 'rgba(255,255,255,.88)'
  },
  layout: {
    sectionSpacing: '5rem',
    containerWidth: '1160px',
    borderRadius: '1.25rem',
    cardStyle: 'soft-elevated',
    shadowStyle: '0 20px 45px rgba(15,23,42,.08)'
  },
  images: {
    heroImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
    backgroundImageUrl: '',
    bannerImageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'
  },
  seo: {
    metaTitle: 'Hospitality Instructor, Trainer & Consultant Portfolio',
    metaDescription: 'Professional portfolio for a hospitality instructor, trainer, educator, consultant, and academic professional.',
    keywords: 'hospitality instructor, hospitality consultant, trainer, educator, academic professional',
    ogTitle: 'Hospitality Professional Portfolio',
    ogDescription: 'Explore qualifications, teaching portfolio, consultancy work, certifications, and achievements.'
  },
  social: {
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    github: 'https://github.com',
    whatsapp: 'https://wa.me/923401614863'
  }
};

export const demoHome = {
  name: 'Dr. Amina Rahman',
  professional_title: 'Hospitality Instructor | Trainer | Consultant | Academic Professional',
  hero_text: 'I help hospitality institutions, learners, and service teams build world-class guest experience, operational excellence, and career-ready skills through evidence-based training and academic leadership.',
  profile_image_url: defaultSettings.images.profileImageUrl,
  resume_url: '#',
  qr_code_url: '/qr-placeholder.svg',
  social_links: defaultSettings.social,
  achievements: [
    '15+ years in hospitality education and industry training',
    'Designed 40+ training modules for hotels, colleges, and service teams',
    'Consulted on guest experience, SOP design, and service quality audits'
  ],
  stats: [
    { label: 'Learners Trained', value: '4,500+' },
    { label: 'Academic Courses', value: '28' },
    { label: 'Consultancy Projects', value: '35+' },
    { label: 'Certifications', value: '18' }
  ]
};

export const demoContent = {
  about_sections: [
    { id: 'a1', title: 'Professional Summary', body: 'Hospitality educator and consultant with experience across hotel operations, front office systems, food and beverage service, guest relations, academic curriculum design, and professional training.', sort_order: 1 },
    { id: 'a2', title: 'Teaching Philosophy', body: 'My teaching approach connects real hotel scenarios with practical classroom activities, role-play, assessment rubrics, and reflective learning so learners can confidently apply theory in service environments.', sort_order: 2 }
  ],
  experiences: [
    { id: 'e1', role: 'Senior Hospitality Instructor', organization: 'International College of Tourism & Hospitality', location: 'Dubai, UAE', start_date: '2018-01-01', end_date: null, description: 'Lead diploma and professional training courses in hotel operations, guest service, front office, and service quality management.', sort_order: 1 },
    { id: 'e2', role: 'Training Consultant', organization: 'Premier Guest Experience Advisory', location: 'Remote / On-site', start_date: '2015-03-01', end_date: '2017-12-31', description: 'Delivered training needs analysis, SOP improvement, mystery guest audits, and staff development programs for hospitality clients.', sort_order: 2 }
  ],
  education: [
    { id: 'ed1', degree: 'PhD in Hospitality Management', institution: 'Global School of Business & Tourism', location: 'Malaysia', year: '2016', description: 'Research focus: service quality, guest satisfaction, and hospitality workforce development.', sort_order: 1 },
    { id: 'ed2', degree: 'MSc Tourism and Hotel Management', institution: 'University of Applied Hospitality Sciences', location: 'UK', year: '2010', description: 'Specialized in hotel operations, tourism strategy, and customer experience.', sort_order: 2 }
  ],
  skills: [
    { id: 's1', name: 'Hospitality Training', category: 'Teaching', percentage: 96, sort_order: 1 },
    { id: 's2', name: 'Curriculum Design', category: 'Academic', percentage: 92, sort_order: 2 },
    { id: 's3', name: 'Guest Experience Audits', category: 'Consultancy', percentage: 90, sort_order: 3 },
    { id: 's4', name: 'Food & Beverage Service', category: 'Operations', percentage: 88, sort_order: 4 },
    { id: 's5', name: 'Front Office Operations', category: 'Operations', percentage: 91, sort_order: 5 }
  ],
  certifications: [
    { id: 'c1', title: 'Certified Hospitality Trainer', issuer: 'Hospitality Training Institute', issue_date: '2022-05-10', certificate_url: '#', image_url: '', description: 'Professional certification in adult learning and hospitality training delivery.', sort_order: 1 },
    { id: 'c2', title: 'Food Safety Level 3', issuer: 'International Food Safety Council', issue_date: '2021-09-15', certificate_url: '#', image_url: '', description: 'Advanced food safety, hygiene management, and compliance training.', sort_order: 2 }
  ],
  teaching_materials: [
    { id: 't1', title: 'Front Office Role-Play Toolkit', course: 'Front Office Operations', material_type: 'Lesson Plan', document_url: '#', description: 'Practical role-play scenarios for reservation, check-in, complaint handling, and upselling.', sort_order: 1 },
    { id: 't2', title: 'Service Quality Rubric', course: 'Guest Relations', material_type: 'Assessment Rubric', document_url: '#', description: 'Rubric for evaluating service language, empathy, problem solving, and professional conduct.', sort_order: 2 }
  ],
  projects: [
    { id: 'p1', title: 'Hospitality Career Readiness Program', client_or_context: 'College Employability Office', project_date: '2024-08-01', image_url: 'https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=800&q=80', document_url: '#', description: 'Designed a career-readiness program covering service etiquette, CV preparation, interview simulations, and workplace expectations.', sort_order: 1 },
    { id: 'p2', title: 'Academic Quality Enhancement Initiative', client_or_context: 'Hospitality Department', project_date: '2023-11-01', image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80', document_url: '#', description: 'Improved course mapping, learning outcomes, assessment design, and student feedback processes.', sort_order: 2 }
  ],
  consultancy_projects: [
    { id: 'cp1', title: 'Hotel Service Excellence Audit', client: 'Boutique Hotel Group', consultancy_date: '2024-04-01', report_url: '#', image_url: '', description: 'Conducted staff observation, guest journey mapping, SOP review, and action plan development.', sort_order: 1 },
    { id: 'cp2', title: 'Restaurant Staff Upskilling Workshop', client: 'Fine Dining Restaurant', consultancy_date: '2023-06-01', report_url: '#', image_url: '', description: 'Delivered customized training for service sequence, menu knowledge, guest recovery, and team communication.', sort_order: 2 }
  ],
  gallery_items: [
    { id: 'g1', title: 'Training Workshop', category: 'Training', image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80', sort_order: 1 },
    { id: 'g2', title: 'Hospitality Classroom', category: 'Teaching', image_url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80', sort_order: 2 },
    { id: 'g3', title: 'Consultancy Session', category: 'Consultancy', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', sort_order: 3 }
  ],
  testimonials: [
    { id: 'tm1', name: 'Michael Anderson', role: 'Hotel General Manager', quote: 'Amina transformed our service training into a practical, measurable, and motivating program for the team.', image_url: '', sort_order: 1 },
    { id: 'tm2', name: 'Sara Khan', role: 'Hospitality Graduate', quote: 'Her classes made hotel operations easy to understand because every lesson connected to real guest situations.', image_url: '', sort_order: 2 }
  ],
  contact_info: [{ id: 'ct1', phone: '+971 00 000 0000', email: 'amina.rahman@example.com', website_url: 'https://example.com', office_address: 'Hospitality Training Centre, Academic City', social_links: defaultSettings.social }]
};
