import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Section({ id, eyebrow, title, children, className = '' }: { id: string; eyebrow?: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={clsx('section-pad', className)}>
      <div className="container-app">
        <div className="mb-10 max-w-3xl">
          {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-primary">{eyebrow}</p>}
          <h2 className="text-3xl text-slate-950 dark:text-white md:text-5xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-app border border-slate-200 bg-white p-6 shadow-app dark:border-slate-800 dark:bg-slate-950', className)}>{children}</div>;
}

export function ButtonLink({ href, children, variant = 'primary' }: { href: string; children: ReactNode; variant?: 'primary' | 'light' }) {
  return (
    <a href={href} className={clsx('focus-ring inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5', variant === 'primary' ? 'bg-brand-primary text-white shadow-lg shadow-teal-900/15' : 'bg-white text-slate-900 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-slate-700')}>
      {children}
    </a>
  );
}

export function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">{label}</div>;
}
