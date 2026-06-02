export function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

export function setProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function applySeo(settings: Record<string, any>) {
  const seo = settings.seo || {};
  document.title = seo.metaTitle || settings.branding?.websiteName || 'Hospitality Portfolio';
  setMeta('description', seo.metaDescription || 'Hospitality instructor, trainer, consultant and academic professional portfolio.');
  setMeta('keywords', seo.keywords || 'hospitality instructor, trainer, consultant, educator, portfolio');
  setProperty('og:title', seo.ogTitle || document.title);
  setProperty('og:description', seo.ogDescription || seo.metaDescription || 'Professional portfolio.');
  setProperty('og:type', 'website');
}
