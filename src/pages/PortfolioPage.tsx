import { useEffect, useState, type FormEvent } from 'react';
import { Award, Briefcase, Download, ExternalLink, GraduationCap, Mail, MapPin, Phone, QrCode, Star, Users } from 'lucide-react';
import { Header, Footer, FloatingActions } from '../components/Layout';
import { ButtonLink, Card, EmptyState, Section } from '../components/ui';
import { demoContent, demoHome } from '../data/demo';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';

type ContentState = typeof demoContent;

async function loadTable(table: string, fallback: any[]) {
  if (!isSupabaseConfigured || !supabase) return fallback;
  const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data?.length ? data : fallback;
}

export default function PortfolioPage() {
  const { settings } = useSettings();
  const [home, setHome] = useState<any>(demoHome);
  const [content, setContent] = useState<ContentState>(demoContent);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formState, setFormState] = useState('');

  useEffect(() => {
    async function load() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: homeRows } = await supabase.from('home_profiles').select('*').limit(1);
          if (homeRows?.[0]) setHome(homeRows[0]);
        }
        const [about_sections, experiences, education, skills, certifications, teaching_materials, projects, consultancy_projects, gallery_items, testimonials, contact_info] = await Promise.all([
          loadTable('about_sections', demoContent.about_sections),
          loadTable('experiences', demoContent.experiences),
          loadTable('education', demoContent.education),
          loadTable('skills', demoContent.skills),
          loadTable('certifications', demoContent.certifications),
          loadTable('teaching_materials', demoContent.teaching_materials),
          loadTable('projects', demoContent.projects),
          loadTable('consultancy_projects', demoContent.consultancy_projects),
          loadTable('gallery_items', demoContent.gallery_items),
          loadTable('testimonials', demoContent.testimonials),
          loadTable('contact_info', demoContent.contact_info)
        ]);
        setContent({ about_sections, experiences, education, skills, certifications, teaching_materials, projects, consultancy_projects, gallery_items, testimonials, contact_info });
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  const contact = content.contact_info[0] || demoContent.contact_info[0];
  const social = home.social_links || settings.social || {};

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
              <p className="mb-4 inline-flex rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-brand-primary ring-1 ring-teal-100 dark:bg-teal-950/40 dark:ring-teal-900">Hospitality Education • Training • Consultancy</p>
              <h1 className="text-4xl leading-tight text-slate-950 dark:text-white md:text-6xl">{home.name}</h1>
              <h2 className="mt-4 text-xl font-semibold text-brand-primary md:text-2xl">{home.professional_title}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{home.hero_text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={home.resume_url || '#'}><Download className="mr-2" size={18} /> Download CV</ButtonLink>
                <ButtonLink href="#contact" variant="light">Contact Me</ButtonLink>
              </div>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                {Object.entries(social).map(([key, value]) => value ? <a className="hover:text-brand-primary" key={key} href={String(value)} target="_blank" rel="noreferrer">{key}</a> : null)}
              </div>
            </div>
            <div className="relative">
              <img className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl" src={home.profile_image_url || settings.images?.profileImageUrl} alt={home.name} loading="eager" />
              <div className="absolute -bottom-6 -left-4 rounded-3xl bg-white p-5 shadow-app dark:bg-slate-900">
                <div className="flex items-center gap-3"><Award className="text-brand-accent" /><span className="font-extrabold">Featured Professional</span></div>
                <p className="mt-1 text-sm text-slate-500">Academic, trainer, and consultant profile</p>
              </div>
            </div>
          </div>
          <div className="container-app mt-14 grid gap-4 md:grid-cols-4">
            {(home.stats || []).map((item: any) => <Card key={item.label} className="p-5 text-center"><p className="text-3xl font-extrabold text-brand-primary">{item.value}</p><p className="mt-1 text-sm text-slate-500">{item.label}</p></Card>)}
          </div>
          <div className="container-app mt-8 grid gap-5 lg:grid-cols-[1fr_260px]">
            <Card>
              <h3 className="mb-4 text-xl">Featured Achievements</h3>
              <div className="grid gap-3 md:grid-cols-3">{(home.achievements || []).map((a: string) => <div key={a} className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900"><Star className="mb-3 text-brand-accent" size={18} />{a}</div>)}</div>
            </Card>
            <Card className="text-center"><QrCode className="mx-auto mb-3 text-brand-primary" /><img src={home.qr_code_url || '/qr-placeholder.svg'} alt="QR code placeholder" className="mx-auto h-32 w-32" loading="lazy" /><p className="mt-3 text-sm text-slate-500">Scan for profile / CV</p></Card>
          </div>
        </section>

        <Section id="about" eyebrow="About" title="Academic profile built on practice">
          <div className="grid gap-5 md:grid-cols-2">{content.about_sections.map((item: any) => <Card key={item.id}><h3 className="mb-3 text-xl">{item.title}</h3><p className="leading-7 text-slate-600 dark:text-slate-300">{item.body}</p></Card>)}</div>
        </Section>

        <Section id="experience" eyebrow="Experience" title="Professional experience">
          <div className="grid gap-5">{content.experiences.map((item: any) => <Card key={item.id}><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><Briefcase className="mb-3 text-brand-primary" /><h3 className="text-2xl">{item.role}</h3><p className="font-semibold text-slate-600 dark:text-slate-300">{item.organization} • {item.location}</p><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.description}</p></div><span className="rounded-full bg-slate-100 px-4 py-2 text-sm dark:bg-slate-800">{item.start_date?.slice(0,4)} – {item.end_date?.slice(0,4) || 'Present'}</span></div></Card>)}</div>
        </Section>

        <Section id="education" eyebrow="Education" title="Academic qualifications">
          <div className="grid gap-5 md:grid-cols-2">{content.education.map((item: any) => <Card key={item.id}><GraduationCap className="mb-3 text-brand-primary" /><h3 className="text-xl">{item.degree}</h3><p className="mt-1 font-semibold text-slate-600 dark:text-slate-300">{item.institution}, {item.location}</p><p className="mt-2 text-sm text-brand-primary">{item.year}</p><p className="mt-3 text-slate-600 dark:text-slate-300">{item.description}</p></Card>)}</div>
        </Section>

        <Section id="skills" eyebrow="Skills" title="Core professional skills">
          <div className="grid gap-5 md:grid-cols-2">{content.skills.map((skill: any) => <Card key={skill.id}><div className="flex justify-between"><h3 className="font-bold">{skill.name}</h3><span className="text-sm font-bold text-brand-primary">{skill.percentage}%</span></div><p className="mb-3 mt-1 text-sm text-slate-500">{skill.category}</p><div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-3 rounded-full bg-brand-primary" style={{ width: `${skill.percentage}%` }} /></div></Card>)}</div>
        </Section>

        <Section id="certifications" eyebrow="Certifications" title="Certifications and credentials">
          <div className="grid gap-5 md:grid-cols-2">{content.certifications.map((item: any) => <Card key={item.id}><Award className="mb-3 text-brand-accent" /><h3 className="text-xl">{item.title}</h3><p className="text-slate-600 dark:text-slate-300">{item.issuer}</p><p className="my-2 text-sm text-slate-500">Issued: {item.issue_date}</p><p className="text-slate-600 dark:text-slate-300">{item.description}</p>{item.certificate_url && <a className="mt-4 inline-flex items-center font-bold text-brand-primary" href={item.certificate_url}>View certificate <ExternalLink className="ml-2" size={16} /></a>}</Card>)}</div>
        </Section>

        <Section id="teaching" eyebrow="Teaching Portfolio" title="Teaching materials and academic resources">
          <div className="grid gap-5 md:grid-cols-2">{content.teaching_materials.map((item: any) => <Card key={item.id}><h3 className="text-xl">{item.title}</h3><p className="mt-1 text-sm font-semibold text-brand-primary">{item.course} • {item.material_type}</p><p className="mt-3 text-slate-600 dark:text-slate-300">{item.description}</p>{item.document_url && <a className="mt-4 inline-flex items-center font-bold text-brand-primary" href={item.document_url}>Open material <ExternalLink className="ml-2" size={16} /></a>}</Card>)}</div>
        </Section>

        <Section id="projects" eyebrow="Projects" title="Projects and achievements">
          <div className="grid gap-5 md:grid-cols-2">{content.projects.map((item: any) => <Card key={item.id} className="overflow-hidden p-0"><img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" loading="lazy" /><div className="p-6"><h3 className="text-xl">{item.title}</h3><p className="mt-1 text-sm text-brand-primary">{item.client_or_context} • {item.project_date}</p><p className="mt-3 text-slate-600 dark:text-slate-300">{item.description}</p></div></Card>)}</div>
        </Section>

        <Section id="consultancy" eyebrow="Consultancy" title="Consultancy work">
          <div className="grid gap-5 md:grid-cols-2">{content.consultancy_projects.map((item: any) => <Card key={item.id}><Users className="mb-3 text-brand-primary" /><h3 className="text-xl">{item.title}</h3><p className="mt-1 font-semibold text-slate-600 dark:text-slate-300">{item.client}</p><p className="my-2 text-sm text-slate-500">{item.consultancy_date}</p><p className="text-slate-600 dark:text-slate-300">{item.description}</p></Card>)}</div>
        </Section>

        <Section id="gallery" eyebrow="Gallery" title="Professional gallery">
          {content.gallery_items.length ? <div className="grid gap-5 md:grid-cols-3">{content.gallery_items.map((item: any) => <figure key={item.id} className="overflow-hidden rounded-app bg-white shadow-app dark:bg-slate-900"><img src={item.image_url} alt={item.title} className="h-64 w-full object-cover transition duration-500 hover:scale-105" loading="lazy" /><figcaption className="p-4"><p className="font-bold">{item.title}</p><p className="text-sm text-slate-500">{item.category}</p></figcaption></figure>)}</div> : <EmptyState label="No gallery items yet." />}
        </Section>

        <Section id="testimonials" eyebrow="Testimonials" title="What people say">
          <div className="grid gap-5 md:grid-cols-2">{content.testimonials.map((item: any) => <Card key={item.id}><p className="text-lg leading-8 text-slate-600 dark:text-slate-300">“{item.quote}”</p><div className="mt-5"><p className="font-bold">{item.name}</p><p className="text-sm text-slate-500">{item.role}</p></div></Card>)}</div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Invite me for training, teaching, or consultancy">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <Card>
              <div className="space-y-5 text-slate-600 dark:text-slate-300">
                <p className="flex gap-3"><Phone className="text-brand-primary" /> {contact.phone}</p>
                <p className="flex gap-3"><Mail className="text-brand-primary" /> {contact.email}</p>
                <p className="flex gap-3"><MapPin className="text-brand-primary" /> {contact.office_address}</p>
              </div>
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
      <FloatingActions whatsapp={social.whatsapp} />
      <Footer />
    </div>
  );
}
