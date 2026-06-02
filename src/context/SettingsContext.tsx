import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { applySeo } from '../lib/seo';
import { defaultSettings } from '../data/demo';

type SettingsContextValue = {
  settings: Record<string, any>;
  loading: boolean;
  reloadSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applyCss(settings: Record<string, any>) {
  const root = document.documentElement;
  const colors = settings.colors || {};
  const typography = settings.typography || {};
  const layout = settings.layout || {};
  root.style.setProperty('--font-family', typography.fontFamily || 'Inter');
  root.style.setProperty('--base-font-size', typography.fontSize || '16px');
  root.style.setProperty('--heading-font-weight', String(typography.headingFontWeight || 800));
  root.style.setProperty('--paragraph-font-weight', String(typography.paragraphFontWeight || 400));
  root.style.setProperty('--color-primary', colors.primaryColor || '#0f766e');
  root.style.setProperty('--color-secondary', colors.secondaryColor || '#0f172a');
  root.style.setProperty('--color-accent', colors.accentColor || '#f59e0b');
  root.style.setProperty('--color-background', colors.backgroundColor || '#f8fafc');
  root.style.setProperty('--color-text', colors.textColor || '#0f172a');
  root.style.setProperty('--color-button', colors.buttonColor || colors.primaryColor || '#0f766e');
  root.style.setProperty('--color-nav', colors.navigationColor || 'rgba(255,255,255,.86)');
  root.style.setProperty('--section-spacing', layout.sectionSpacing || '5rem');
  root.style.setProperty('--container-width', layout.containerWidth || '1160px');
  root.style.setProperty('--radius-card', layout.borderRadius || '1.25rem');
  root.style.setProperty('--shadow-card', layout.shadowStyle || '0 20px 45px rgba(15,23,42,.08)');
}

function rowsToSettings(rows: any[]) {
  return rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {} as Record<string, any>);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, any>>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const reloadSettings = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;
        if (data && data.length) setSettings({ ...defaultSettings, ...rowsToSettings(data) });
      }
    } catch (error) {
      console.error('Settings load failed, using demo defaults.', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reloadSettings(); }, []);
  useEffect(() => { applyCss(settings); applySeo(settings); }, [settings]);

  const value = useMemo(() => ({ settings, loading, reloadSettings }), [settings, loading]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
