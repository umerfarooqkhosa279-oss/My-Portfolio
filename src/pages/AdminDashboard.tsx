import { useMemo, useState } from 'react';
import { BarChart3, Database, Home, LogOut, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { managers } from '../admin/config';
import GenericManager from '../admin/GenericManager';
import SettingsManager from '../admin/SettingsManager';
import MessagesManager from '../admin/MessagesManager';

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const { signOut, user } = useAuth();
  const { reloadSettings } = useSettings();
  const activeManager = useMemo(() => managers.find(m => m.table === active), [active]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[290px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <Link to="/" className="mb-6 flex items-center gap-3 font-extrabold"><Home className="text-brand-primary" /> View Website</Link>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Admin Dashboard</p>
          <nav className="space-y-1">
            <button onClick={() => setActive('overview')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold ${active === 'overview' ? 'bg-brand-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><BarChart3 size={16} /> Overview</button>
            {managers.map(m => <button key={m.table} onClick={() => setActive(m.table)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold ${active === m.table ? 'bg-brand-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Database size={16} /> {m.title.replace(' Management', '')}</button>)}
            <button onClick={() => setActive('settings')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold ${active === 'settings' ? 'bg-brand-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Settings size={16} /> Website Settings</button>
            <button onClick={() => setActive('messages')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold ${active === 'messages' ? 'bg-brand-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><MessageSquare size={16} /> Contact Messages</button>
          </nav>
          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-800">
            <p className="font-bold text-slate-700 dark:text-slate-200">Logged in</p>
            <p className="mt-1 break-all">{user?.email}</p>
            <button onClick={signOut} className="mt-3 inline-flex items-center gap-2 font-bold text-red-600"><LogOut size={14} /> Logout</button>
          </div>
        </aside>
        <main className="p-4 md:p-8">
          {active === 'overview' && <Overview />}
          {activeManager && <GenericManager config={activeManager} onChanged={reloadSettings} />}
          {active === 'settings' && <SettingsManager />}
          {active === 'messages' && <MessagesManager />}
        </main>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-5">
      <div className="admin-card">
        <h1 className="text-3xl font-extrabold">Portfolio CMS Dashboard</h1>
        <p className="mt-2 text-slate-500">Manage every portfolio section, upload files, update branding, customize colors, adjust layout, and review contact messages.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="admin-card"><p className="text-3xl font-extrabold text-brand-primary">12</p><p className="text-sm text-slate-500">Portfolio sections</p></div>
        <div className="admin-card"><p className="text-3xl font-extrabold text-brand-primary">7</p><p className="text-sm text-slate-500">Customization groups</p></div>
        <div className="admin-card"><p className="text-3xl font-extrabold text-brand-primary">4</p><p className="text-sm text-slate-500">Storage buckets</p></div>
      </div>
      <div className="admin-card"><h2 className="text-xl font-bold">Setup reminder</h2><p className="mt-2 text-slate-500">Create the admin account in Supabase Auth, run the SQL schema, add environment variables, then deploy to Vercel. Full instructions are in README.md.</p></div>
    </div>
  );
}
