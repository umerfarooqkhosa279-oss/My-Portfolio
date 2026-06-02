import { Link } from 'react-router-dom';
import { ArrowUp, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';

const nav = [
  ['Home', '#home'], ['About', '#about'], ['Experience', '#experience'], ['Education', '#education'], ['Skills', '#skills'], ['Certifications', '#certifications'], ['Teaching', '#teaching'], ['Projects', '#projects'], ['Consultancy', '#consultancy'], ['Gallery', '#gallery'], ['Testimonials', '#testimonials'], ['Contact', '#contact']
];

export function Header() {
  const { settings } = useSettings();
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="container-app flex min-h-16 items-center justify-between gap-4 py-3">
        <a href="#home" className="flex items-center gap-3 font-extrabold text-slate-950 dark:text-white">
          <img src={settings.branding?.logoUrl || '/favicon.svg'} alt="Logo" className="h-9 w-9 rounded-xl" loading="lazy" />
          <span className="hidden sm:inline">{settings.branding?.websiteName || 'Portfolio'}</span>
        </a>
        <nav className="hidden max-w-4xl items-center gap-4 overflow-x-auto text-sm font-semibold text-slate-600 lg:flex dark:text-slate-300">
          {nav.map(([label, href]) => <a key={href} href={href} className="whitespace-nowrap hover:text-brand-primary">{label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <button aria-label="Toggle dark mode" onClick={() => setDark(!dark)} className="focus-ring rounded-full border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <Link to="/admin/login" className="focus-ring rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950">Admin</Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-app flex flex-col justify-between gap-4 text-sm text-slate-500 md:flex-row">
        <p>{settings.branding?.footerText}</p>
        <Link to="/admin/login" className="font-semibold text-brand-primary">Admin Panel</Link>
      </div>
    </footer>
  );
}

export function FloatingActions({ whatsapp }: { whatsapp?: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {whatsapp && <a className="focus-ring rounded-full bg-green-500 px-4 py-3 text-sm font-bold text-white shadow-lg" href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>}
      <a aria-label="Back to top" href="#home" className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"><ArrowUp size={18} /></a>
    </div>
  );
}
