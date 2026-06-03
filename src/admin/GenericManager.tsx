import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { ManagerConfig } from '../types/content';
import { supabase, uploadFile } from '../lib/supabase';

function emptyRecord(config: ManagerConfig) {
  return config.fields.reduce((acc, field) => ({ ...acc, [field.name]: field.type === 'json' ? {} : field.type === 'number' ? 0 : '' }), {} as Record<string, any>);
}

function parseValue(value: any, type?: string) {
  if (type === 'number') return Number(value || 0);
  if (type === 'json') {
    if (typeof value === 'string') return value.trim() ? JSON.parse(value) : null;
    return value;
  }
  return value || null;
}

export default function GenericManager({ config, onChanged }: { config: ManagerConfig; onChanged?: () => void }) {
  const [records, setRecords] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const sorted = useMemo(() => [...records].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)), [records]);

  async function load() {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase is not configured.');

      const query = config.singleton
        ? supabase.from(config.table).select('*').order('updated_at', { ascending: false }).limit(1)
        : supabase.from(config.table).select('*').order('sort_order', { ascending: true });

      const { data, error } = await query;
      if (error) throw error;

      const rows = data || [];
      setRecords(rows);

      // Singleton sections such as Home and Contact should always show one edit form.
      // If no row exists yet, show an empty form so the admin can create it.
      if (config.singleton) setEditing(rows[0] || emptyRecord(config));
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [config.table]);

  async function save(e: FormEvent) {
    e.preventDefault();
    try {
      if (!supabase || !editing) throw new Error('Missing Supabase or record.');
      const payload: any = {};
      for (const field of config.fields) payload[field.name] = parseValue(editing[field.name], field.type);
      if (editing.id) {
        const { error } = await supabase.from(config.table).update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(config.table).insert(payload);
        if (error) throw error;
      }
      setMessage('Saved successfully.');
      if (!config.singleton) setEditing(null);
      await load();
      onChanged?.();
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this record?')) return;
    try {
      if (!supabase) throw new Error('Supabase is not configured.');
      const { error } = await supabase.from(config.table).delete().eq('id', id);
      if (error) throw error;
      setMessage('Deleted.');
      await load();
      onChanged?.();
    } catch (error: any) { setMessage(error.message); }
  }

  async function handleFile(fieldName: string, bucket: string, folder: string, file?: File) {
    if (!file) return;
    try {
      setMessage('Uploading file...');
      const url = await uploadFile(bucket, folder, file);
      setEditing((prev: any) => ({ ...prev, [fieldName]: url }));
      setMessage('File uploaded. Save the record to keep this URL.');
    } catch (error: any) { setMessage(error.message); }
  }

  return (
    <div className="space-y-5">
      <div className="admin-card">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold">{config.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{config.description}</p>
          </div>
          {!config.singleton && <button onClick={() => setEditing(emptyRecord(config))} className="inline-flex items-center rounded-xl bg-brand-primary px-4 py-2 text-sm font-bold text-white"><Plus className="mr-2" size={16} /> Add New</button>}
        </div>
        {message && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">{message}</p>}
      </div>

      {editing && (
        <form className="admin-card grid gap-4" onSubmit={save}>
          <div className="flex items-center justify-between"><h3 className="text-lg font-bold">{editing.id ? 'Edit Record' : 'Create Record'}</h3>{!config.singleton && <button type="button" onClick={() => setEditing(null)}><X /></button>}</div>
          <div className="grid gap-4 md:grid-cols-2">
            {config.fields.map(field => (
              <label key={field.name} className={field.type === 'textarea' || field.type === 'json' ? 'md:col-span-2' : ''}>
                <span className="admin-label">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea className="admin-input mt-1 min-h-28" value={editing[field.name] || ''} required={field.required} onChange={e => setEditing({ ...editing, [field.name]: e.target.value })} />
                ) : field.type === 'json' ? (
                  <textarea className="admin-input mt-1 min-h-32 font-mono text-xs" value={typeof editing[field.name] === 'string' ? editing[field.name] : JSON.stringify(editing[field.name] ?? {}, null, 2)} onChange={e => setEditing({ ...editing, [field.name]: e.target.value })} />
                ) : field.type === 'file' ? (
                  <div className="mt-1 space-y-2">
                    <input className="admin-input" value={editing[field.name] || ''} onChange={e => setEditing({ ...editing, [field.name]: e.target.value })} placeholder="URL will appear after upload" />
                    <input className="admin-input" type="file" onChange={e => handleFile(field.name, field.bucket || 'portfolio-assets', field.folder || 'uploads', e.target.files?.[0])} />
                  </div>
                ) : (
                  <input className="admin-input mt-1" type={field.type || 'text'} value={editing[field.name] || ''} required={field.required} onChange={e => setEditing({ ...editing, [field.name]: e.target.value })} />
                )}
              </label>
            ))}
          </div>
          <button className="inline-flex w-fit items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950"><Save className="mr-2" size={16} /> Save Changes</button>
        </form>
      )}

      {!config.singleton && <div className="admin-card overflow-x-auto">
        {loading ? <p>Loading records...</p> : <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b text-left text-slate-500"><th className="py-3">Primary</th><th>Details</th><th>Sort</th><th className="text-right">Actions</th></tr></thead>
          <tbody>{sorted.map(row => <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800"><td className="py-3 font-bold">{row.title || row.name || row.role || row.degree || row.phone}</td><td className="max-w-md truncate text-slate-500">{row.description || row.body || row.quote || row.email}</td><td>{row.sort_order}</td><td className="text-right"><button onClick={() => setEditing(row)} className="mr-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil size={16} /></button><button onClick={() => remove(row.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></td></tr>)}</tbody>
        </table>}
      </div>}
    </div>
  );
}
