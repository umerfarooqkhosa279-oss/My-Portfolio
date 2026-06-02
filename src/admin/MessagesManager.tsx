import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [notice, setNotice] = useState('');

  async function load() {
    try {
      if (!supabase) throw new Error('Supabase is not configured.');
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) { setNotice(error.message); }
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    if (!supabase) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) setNotice(error.message); else load();
  }

  return <div className="space-y-5"><div className="admin-card"><h2 className="text-2xl font-extrabold">Contact Messages</h2><p className="text-sm text-slate-500">Messages submitted from the public contact form.</p>{notice && <p className="mt-3 text-sm text-red-600">{notice}</p>}</div><div className="grid gap-4">{messages.map(m => <div className="admin-card" key={m.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold">{m.name}</h3><p className="text-sm text-brand-primary">{m.email}</p><p className="mt-3 whitespace-pre-wrap text-slate-600 dark:text-slate-300">{m.message}</p><p className="mt-3 text-xs text-slate-400">{new Date(m.created_at).toLocaleString()}</p></div><button onClick={() => remove(m.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></div>)}{!messages.length && <p className="admin-card text-slate-500">No messages yet.</p>}</div></div>;
}
