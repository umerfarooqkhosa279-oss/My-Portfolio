import { useEffect, useState, type FormEvent } from 'react';
import { Award, Briefcase, Download, ExternalLink, GraduationCap, Mail, MapPin, Phone, QrCode, Star, Users } from 'lucide-react';
import { Header, Footer, FloatingActions } from '../components/Layout';
import { ButtonLink, Card, EmptyState, Section } from '../components/ui';
import { demoContent, demoHome } from '../data/demo';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';

type ContentState = typeof demoContent;


function normalizeWhatsAppLink(value?: unknown) {
  if (!value) return '';
  const raw = String(value).trim();
  if (!raw) return '';

  const digits = raw.replace(/\D/g, '');
  const isPlaceholder = digits.length > 0 && /^0+$/.test(digits);
  if (isPlaceholder) return '';

  if (/^https?:\/\//i.test(raw)) return raw;
  return digits ? `https://wa.me/${digits}` : '';
}

const emptyContent: ContentState = {
  about_sections: [],
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  teaching_materials: [],
  projects: [],
  consultancy_projects: [],
  gallery_items: [],
  testimonials: [],
  contact_info: []
};

async function loadTable(table: string, fallback: any[] = []) {
  if (!isSupabaseConfigured || !supabase) return fallback;

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  // Important: when Supabase is configured, do NOT return demo fallback.
  // This prevents dummy content from appearing before/after CMS data loads.
  return data || [];
}

export default function PortfolioPage() {
  const { settings, loading: settingsLoading } = useSettings();
  const [home, setHome] = useState<any | null>(null);
  const [content, setContent] = useState<ContentState>(emptyContent);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formState, setFormState] = useState('');

  useEffect(() => {
    async function load() {
      setPageLoading(true);
      setLoadError('');

      try {
        if (!isSupabaseConfigured || !supabase) {
          // Demo mode only for local development when Supabase env variables are missing.
          setHome(demoHome);
          setContent(demoContent);
          return;
        }

        const { data: homeRows, error: homeError } = await supabase
          .from('home_profiles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (homeError) throw homeError;
        setHome(homeRows?.[0] || null);

        const [about_sections, experiences, education, skills, certifications, teaching_materials, projects, consultancy_projects, gallery_items, testimonials, contact_info] = await Promise.all([
          loadTable('about_sections'),
          loadTable('experiences'),
          loadTable('education'),
          loadTable('skills'),
          loadTable('certifications'),
          loadTable('teaching_materials'),
          loadTable('projects'),
          loadTable('consultancy_projects'),
          loadTable('gallery_items'),
          loadTable('testimonials'),
          loadTable('contact_info')
        ]);

        setContent({ about_sections, experiences, education, skills, certifications, teaching_materials, projects, consultancy_projects, gallery_items, testimonials, contact_info });
      } catch (error: any) {
        console.error(error);
        setLoadError(error.message || 'Could not load portfolio content.');
      } finally {
        setPageLoading(false);
      }
    }

    load();
  }, []);

  if (settingsLoading || pageLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center dark:bg-slate-950 dark:text-slate-100">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-primary">Loading</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">Preparing portfolio...</h1>
        </div>
      </div>
    );
  }

  if (loadError && !home) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-xl rounded-2xl border border-red-200 bg-white p-6 shadow-app dark:border-red-900 dark:bg-slate-900">
          <h1 className="text-2xl font-extrabold text-red-600">Portfolio content could not load</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-app dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">No home profile found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Open Admin Panel → Home Management and save your home profile.</p>
        </div>
      </div>
    );
  }

  const contact = content.contact_info[0];
  const whatsappLink = normalizeWhatsAppLink(settings.social?.whatsapp)
    || normalizeWhatsAppLink(home.social_links?.whatsapp)
    || normalizeWhatsAppLink(contact?.social_links?.whatsapp);
  const social = {
    ...(home.social_links || {}),
    ...(contact?.social_links || {}),
    ...(settings.social || {}),
    whatsapp: whatsappLink
  };
  const heroBadgeText = settings.branding?.heroBadgeText || 'Culinary Arts • Education • Food Processing';

  async function submitContact(e: FormEvent) {
    e.preventDefault();
    setFormState('Sending...');
    try {
      if (supabase) {
        const { error } = await supabase.from('contact_messages').insert(contactForm);
        if (error) throw error;
      }
      setContactForm({ name: '', email: '', message: '' });
      setFormState('Message saved successfully.');
    } catch (error: any) {
      setFormState(error.message || 'Could not send message.');
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <main>
        <section id="home" className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,.18),transparent_28%)]" />
          <div className="container-app grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div className="animate-fade-up">
              <p className="mb-4 inline-flex rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-brand-primary ring-1 ring-teal-100 dark:bg-teal-950/40 dark:ring-teal-900">{heroBadgeText}</p>
              <h1 className="text-4xl leading-tight text-slate-950 dark:text-white md:text-6xl">{home.name}</h1>
              <h2 className="mt-4 text-xl font-semibold text-brand-primary md:text-2xl">{home.professional_title}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{home.hero_text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {home.resume_url && <ButtonLink href={home.resume_url}><Download className="mr-2" size={18} /> Download CV</ButtonLink>}
                <ButtonLink href="#contact" variant="light">Contact Me</ButtonLink>
              </div>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                {Object.entries(social).map(([key, value]) => {
                  const href = key.toLowerCase() === 'whatsapp' ? normalizeWhatsAppLink(value) : String(value || '').trim();
                  return href ? <a className="hover:text-brand-primary" key={key} href={href} target="_blank" rel="noreferrer">{key}</a> : null;
                })}
              </div>
            </div>
            {(home.profile_image_url || settings.images?.profileImageUrl) && (
              <div className="relative">
                <img className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl" src={home.profile_image_url || settings.images?.profileImageUrl} alt={home.name} loading="eager" />
                <div className="absolute -bottom-6 -left-4 rounded-3xl bg-white p-5 shadow-app dark:bg-slate-900">
                  <div className="flex items-center gap-3"><Award className="text-brand-accent" /><span className="font-extrabold">Featured Professional</span></div>
                  <p className="mt-1 text-sm text-slate-500">Academic, trainer, and consultant profile</p>
                </div>
              </div>
            )}
          </div>
          {!!home.stats?.length && (
            <div className="container-app mt-14 grid gap-4 md:grid-cols-4">
              {home.stats.map((item: any) => <Card key={item.label} className="p-5 text-center"><p className="text-3xl font-extrabold text-brand-primary">{item.value}</p><p className="mt-1 text-sm text-slate-500">{item.label}</p></Card>)}
            </div>
          )}
          <div className="container-app mt-8 grid gap-5 lg:grid-cols-[1fr_260px]">
            {!!home.achievements?.length && (
              <Card>
                <h3 className="mb-4 text-xl">Featured Achievements</h3>
                <div className="grid gap-3 md:grid-cols-3">{home.achievements.map((a: string) => <div key={a} className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900"><Star className="mb-3 text-brand-accent" size={18} />{a}</div>)}</div>
              </Card>
            )}
            {home.qr_code_url && <Card className="text-center"><QrCode className="mx-auto mb-3 text-brand-primary" /><img src={home.qr_code_url} alt="QR code" className="mx-auto h-32 w-32" loading="lazy" /><p className="mt-3 text-sm text-slate-500">Scan for profile / CV</p></Card>}
          </div>
        </section>

        <Section id="about" eyebrow="About" title="Academic profile built on practice">
          {content.about_sections.length ? <div className="grid gap-5 md:grid-cols-2">{content.about_sections.map((item: any) => <Card key={item.id}><h3 className="mb-3 text-xl">{item.title}</h3><p className="leading-7 text-slate-600 dark:text-slate-300">{item.body}</p></Card>)}</div> : <EmptyState label="No about content yet." />}
        </Section>

        <Section id="experience" eyebrow="Experience" title="Professional experience">
          {content.experiences.length ? <div className="grid gap-5">{content.experiences.map((item: any) => <Card key={item.id}><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><Briefcase className="mb-3 text-brand-primary" /><h3 className="text-2xl">{item.role}</h3><p className="font-semibold text-slate-600 dark:text-slate-300">{item.organization} • {item.location}</p><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.description}</p></div><span className="rounded-full bg-slate-100 px-4 py-2 text-sm dark:bg-slate-800">{item.start_date?.slice(0,4)} – {item.end_date?.slice(0,4) || 'Present'}</span></div></Card>)}</div> : <EmptyState label="No experience records yet." />}
        </Section>

        <Section id="education" eyebrow="Education" title="Academic qualifications">
          {content.education.length ? <div className="grid gap-5 md:grid-cols-2">{content.education.map((item: any) => <Card key={item.id}><GraduationCap className="mb-3 text-brand-primary" /><h3 className="text-xl">{item.degree}</h3><p className="mt-1 font-semibold text-slate-600 dark:text-slate-300">{item.institution}, {item.location}</p><p className="mt-2 text-sm text-brand-primary">{item.year}</p><p className="mt-3 text-slate-600 dark:text-slate-300">{item.description}</p></Card>)}</div> : <EmptyState label="No education records yet." />}
        </Section>

        <Section id="skills" eyebrow="Skills" title="Core professional skills">
          {content.skills.length ? <div className="grid gap-5 md:grid-cols-2">{content.skills.map((skill: any) => <Card key={skill.id}><div className="flex justify-between"><h3 className="font-bold">{skill.name}</h3><span className="text-sm font-bold text-brand-primary">{skill.percentage}%</span></div><p className="mb-3 mt-1 text-sm text-slate-500">{skill.category}</p><div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-3 rounded-full bg-brand-primary" style={{ width: `${skill.percentage}%` }} /></div></Card>)}</div> : <EmptyState label="No skills yet." />}
        </Section>

        <Section id="certifications" eyebrow="Certifications" title="Certifications and credentials">
          {content.certifications.length ? <div className="grid gap-5 md:grid-cols-2">{content.certifications.map((item: any) => <Card key={item.id}><Award className="mb-3 text-brand-accent" /><h3 className="text-xl">{item.title}</h3><p className="text-slate-600 dark:text-slate-300">{item.issuer}</p><p className="my-2 text-sm text-slate-500">Issued: {item.issue_date}</p><p className="text-slate-600 dark:text-slate-300">{item.description}</p>{item.certificate_url && <a className="mt-4 inline-flex items-center font-bold text-brand-primary" href={item.certificate_url}>View certificate <ExternalLink className="ml-2" size={16} /></a>}</Card>)}</div> : <EmptyState label="No certifications yet." />}
        </Section>

        <Section id="teaching" eyebrow="Teaching Portfolio" title="Teaching materials and academic resources">
          {content.teaching_materials.length ? <div className="grid gap-5 md:grid-cols-2">{content.teaching_materials.map((item: any) => <Card key={item.id}><h3 className="text-xl">{item.title}</h3><p className="mt-1 text-sm font-semibold text-brand-primary">{item.course} • {item.material_type}</p><p className="mt-3 text-slate-600 dark:text-slate-300">{item.description}</p>{item.document_url && <a className="mt-4 inline-flex items-center font-bold text-brand-primary" href={item.document_url}>Open material <ExternalLink className="ml-2" size={16} /></a>}</Card>)}</div> : <EmptyState label="No teaching materials yet." />}
        </Section>

        <Section id="projects" eyebrow="Projects" title="Projects and achievements">
          {content.projects.length ? <div className="grid gap-5 md:grid-cols-2">{content.projects.map((item: any) => <Card key={item.id} className="overflow-hidden p-0">{item.image_url && <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" loading="lazy" />}<div className="p-6"><h3 className="text-xl">{item.title}</h3><p className="mt-1 text-sm text-brand-primary">{item.client_or_context} • {item.project_date}</p><p className="mt-3 text-slate-600 dark:text-slate-300">{item.description}</p></div></Card>)}</div> : <EmptyState label="No projects yet." />}
        </Section>

        <Section id="consultancy" eyebrow="Consultancy" title="Consultancy work">
          {content.consultancy_projects.length ? <div className="grid gap-5 md:grid-cols-2">{content.consultancy_projects.map((item: any) => <Card key={item.id}><Users className="mb-3 text-brand-primary" /><h3 className="text-xl">{item.title}</h3><p className="mt-1 font-semibold text-slate-600 dark:text-slate-300">{item.client}</p><p className="my-2 text-sm text-slate-500">{item.consultancy_date}</p><p className="text-slate-600 dark:text-slate-300">{item.description}</p></Card>)}</div> : <EmptyState label="No consultancy records yet." />}
        </Section>

        <Section id="gallery" eyebrow="Gallery" title="Professional gallery">
          {content.gallery_items.length ? <div className="grid gap-5 md:grid-cols-3">{content.gallery_items.map((item: any) => <figure key={item.id} className="overflow-hidden rounded-app bg-white shadow-app dark:bg-slate-900"><img src={item.image_url} alt={item.title} className="h-64 w-full object-cover transition duration-500 hover:scale-105" loading="lazy" /><figcaption className="p-4"><p className="font-bold">{item.title}</p><p className="text-sm text-slate-500">{item.category}</p></figcaption></figure>)}</div> : <EmptyState label="No gallery items yet." />}
        </Section>

        <Section id="testimonials" eyebrow="Testimonials" title="What people say">
          {content.testimonials.length ? <div className="grid gap-5 md:grid-cols-2">{content.testimonials.map((item: any) => <Card key={item.id}><p className="text-lg leading-8 text-slate-600 dark:text-slate-300">“{item.quote}”</p><div className="mt-5"><p className="font-bold">{item.name}</p><p className="text-sm text-slate-500">{item.role}</p></div></Card>)}</div> : <EmptyState label="No testimonials yet." />}
        </Section>

        <Section id="contact" eyebrow="Contact" title="Invite me for training, teaching, or consultancy">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <Card>
              {contact ? (
                <div className="space-y-5 text-slate-600 dark:text-slate-300">
                  {contact.phone && <p className="flex gap-3"><Phone className="text-brand-primary" /> {contact.phone}</p>}
                  {contact.email && <p className="flex gap-3"><Mail className="text-brand-primary" /> {contact.email}</p>}
                  {contact.office_address && <p className="flex gap-3"><MapPin className="text-brand-primary" /> {contact.office_address}</p>}
                </div>
              ) : <EmptyState label="No contact information yet." />}
            </Card>
            <Card>
              <form className="grid gap-4" onSubmit={submitContact}>
                <input className="admin-input" required placeholder="Your name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                <input className="admin-input" required type="email" placeholder="Email address" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                <textarea className="admin-input min-h-36" required placeholder="Message" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} />
                <button className="focus-ring rounded-full bg-brand-primary px-6 py-3 font-bold text-white" type="submit">Send Message</button>
                {formState && <p className="text-sm text-slate-500">{formState}</p>}
              </form>
            </Card>
          </div>
        </Section>
      </main>
      <FloatingActions whatsapp={whatsappLink} />
      <Footer />
    </div>
  );
}
