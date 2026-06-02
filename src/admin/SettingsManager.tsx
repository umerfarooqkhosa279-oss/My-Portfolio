import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase, uploadFile } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import { defaultSettings } from '../data/demo';

const settingGroups: Record<string, { title: string; fields: { name: string; label: string; type?: string; bucket?: string; folder?: string }[] }> = {
  branding: { title: 'Branding Settings', fields: [{ name: 'websiteName', label: 'Website Name' }, { name: 'logoUrl', label: 'Logo', type: 'file', bucket: 'portfolio-assets', folder: 'branding' }, { name: 'faviconUrl', label: 'Favicon', type: 'file', bucket: 'portfolio-assets', folder: 'branding' }, { name: 'footerText', label: 'Footer Text' }] },
  typography: { title: 'Typography Settings', fields: [{ name: 'fontFamily', label: 'Font Family' }, { name: 'fontSize', label: 'Font Size' }, { name: 'headingFontWeight', label: 'Heading Font Weight' }, { name: 'paragraphFontWeight', label: 'Paragraph Font Weight' }] },
  colors: { title: 'Color Settings', fields: [{ name: 'primaryColor', label: 'Primary Color', type: 'color' }, { name: 'secondaryColor', label: 'Secondary Color', type: 'color' }, { name: 'accentColor', label: 'Accent Color', type: 'color' }, { name: 'backgroundColor', label: 'Background Color', type: 'color' }, { name: 'textColor', label: 'Text Color', type: 'color' }, { name: 'buttonColor', label: 'Button Color', type: 'color' }, { name: 'navigationColor', label: 'Navigation Color' }] },
  layout: { title: 'Layout Settings', fields: [{ name: 'sectionSpacing', label: 'Section Spacing' }, { name: 'containerWidth', label: 'Container Width' }, { name: 'borderRadius', label: 'Border Radius' }, { name: 'cardStyle', label: 'Card Style' }, { name: 'shadowStyle', label: 'Shadow Style' }] },
  images: { title: 'Image Settings', fields: [{ name: 'heroImageUrl', label: 'Hero Image', type: 'file', bucket: 'portfolio-assets', folder: 'settings' }, { name: 'profileImageUrl', label: 'Profile Image', type: 'file', bucket: 'portfolio-assets', folder: 'settings' }, { name: 'backgroundImageUrl', label: 'Background Image', type: 'file', bucket: 'portfolio-assets', folder: 'settings' }, { name: 'bannerImageUrl', label: 'Section Banner', type: 'file', bucket: 'portfolio-assets', folder: 'settings' }] },
  seo: { title: 'SEO Settings', fields: [{ name: 'metaTitle', label: 'Meta Title' }, { name: 'metaDescription', label: 'Meta Description' }, { name: 'keywords', label: 'Keywords' }, { name: 'ogTitle', label: 'Open Graph Title' }, { name: 'ogDescription', label: 'Open Graph Description' }] },
  social: { title: 'Social Media Settings', fields: [{ name: 'linkedin', label: 'LinkedIn' }, { name: 'facebook', label: 'Facebook' }, { name: 'instagram', label: 'Instagram' }, { name: 'youtube', label: 'YouTube' }, { name: 'github', label: 'GitHub' }, { name: 'whatsapp', label: 'WhatsApp' }] }
};

export default function SettingsManager() {
  const { settings, reloadSettings } = useSettings();
  const [local, setLocal] = useState(defaultSettings);
  const [message, setMessage] = useState('');

  useEffect(() => setLocal(settings as any), [settings]);

  async function save() {
    try {
      if (!supabase) throw new Error('Supabase is not configured.');
      for (const [key, value] of Object.entries(local)) {
        const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
        if (error) throw error;
      }
      setMessage('Settings saved and applied.');
      await reloadSettings();
    } catch (error: any) { setMessage(error.message); }
  }

  async function handleFile(group: string, field: string, bucket: string, folder: string, file?: File) {
    if (!file) return;
    try {
      setMessage('Uploading...');
      const url = await uploadFile(bucket, folder, file);
      setLocal((prev: any) => ({ ...prev, [group]: { ...prev[group], [field]: url } }));
      setMessage('Uploaded. Click Save Settings to publish it.');
    } catch (error: any) { setMessage(error.message); }
  }

  return (
    <div className="space-y-5">
      <div className="admin-card flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div><h2 className="text-2xl font-extrabold">Website Settings</h2><p className="text-sm text-slate-500">Customize branding, fonts, colors, layout, images, SEO, and social links without editing code.</p></div>
        <button onClick={save} className="inline-flex items-center rounded-xl bg-brand-primary px-5 py-3 text-sm font-bold text-white"><Save className="mr-2" size={16} /> Save Settings</button>
      </div>
      {message && <p className="admin-card text-sm text-slate-600 dark:text-slate-300">{message}</p>}
      <div className="grid gap-5 lg:grid-cols-2">
        {Object.entries(settingGroups).map(([groupKey, group]) => (
          <div key={groupKey} className="admin-card">
            <h3 className="mb-4 text-lg font-bold">{group.title}</h3>
            <div className="grid gap-4">
              {group.fields.map(field => <label key={field.name}><span className="admin-label">{field.label}</span>
                {field.type === 'file' ? <div className="mt-1 space-y-2"><input className="admin-input" value={(local as any)[groupKey]?.[field.name] || ''} onChange={e => setLocal((prev: any) => ({ ...prev, [groupKey]: { ...prev[groupKey], [field.name]: e.target.value } }))} /><input className="admin-input" type="file" onChange={e => handleFile(groupKey, field.name, field.bucket || 'portfolio-assets', field.folder || 'settings', e.target.files?.[0])} /></div> : <input className="admin-input mt-1" type={field.type || 'text'} value={(local as any)[groupKey]?.[field.name] || ''} onChange={e => setLocal((prev: any) => ({ ...prev, [groupKey]: { ...prev[groupKey], [field.name]: e.target.value } }))} />}
              </label>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
