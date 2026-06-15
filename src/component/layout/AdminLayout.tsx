import Link from 'next/link';
import { ReactNode } from 'react';
import Head from 'next/head';
import BrandLogo from '@/component/brand/BrandLogo';

type Props = { title: string; children: ReactNode };

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Usuários' },
  { href: '/admin/cancel-requests', label: 'Cancelamentos' },
  { href: '/admin/audit', label: 'Auditoria' },
];

export default function AdminLayout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title} | Admin Conta+</title>
      </Head>
      <div className="min-h-screen bg-cp-base text-slate-100">
        <header className="border-b border-white/10 bg-cp-card/80">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <BrandLogo size="compact" />
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-200">
                Admin
              </span>
            </div>
            <nav className="hidden gap-4 text-sm md:flex">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="text-slate-400 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link href="/dashboard" className="text-xs text-slate-500 hover:text-slate-300">
              Voltar ao app
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    </>
  );
}
