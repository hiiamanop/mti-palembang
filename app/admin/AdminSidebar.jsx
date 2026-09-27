'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Users,
  Compass,
  Calendar,
  FileText,
  Newspaper,
  BookOpen,
  Video,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { logout } from './actions';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const navGroups = [
    {
      title: 'PENGELOLAAN HALAMAN',
      items: [
        { label: 'Beranda', href: '/admin/beranda', icon: Home, desc: 'Hero, Visi-Misi, Program' },
        { label: 'Hero Halaman Kegiatan', href: '/admin/hero-kegiatan', icon: Compass, desc: 'Banner atas /kegiatan-mti' },
        { label: 'Header Artikel & Opini', href: '/admin/header-artikel', icon: FileText, desc: 'Banner atas /artikel' },
        { label: 'Tentang Kami', href: '/admin/tentang-kami', icon: Users, desc: 'Profil, Struktur, Identitas' }
      ]
    },
    {
      title: 'KONTEN BERKALA',
      items: [
        { label: 'Kegiatan MTI', href: '/admin/kegiatan', icon: Calendar },
        { label: 'Artikel & Opini', href: '/admin/artikel', icon: FileText },
        { label: 'Berita', href: '/admin/berita', icon: Newspaper },
        { label: 'Jurnal AKSES', href: '/admin/jurnal', icon: BookOpen },
        { label: 'Media Video', href: '/admin/media', icon: Video }
      ]
    },
    {
      title: 'HUBUNGAN PUBLIK',
      items: [
        { label: 'Kontak CRM', href: '/admin/kontak-crm', icon: Mail, desc: 'Permintaan kontak masuk' }
      ]
    }
  ];

  return (
    <>
      {/* ── Mobile Top Header ── */}
      <div className="adminMobileTopBar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <strong style={{ color: '#fff', fontSize: 16 }}>MTI CMS</strong>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`adminSidebar ${mobileOpen ? 'adminSidebarMobileOpen' : ''}`}>
        <div className="adminSidebarBrand">
          <strong>MTI SUMSEL</strong>
          <small>Panel Pengelola Konten</small>
        </div>

        <nav className="adminSidebarNav">
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className={`adminNavItem ${isActive('/admin') ? 'adminNavItemActive' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </Link>

          {navGroups.map((group) => (
            <div key={group.title} className="adminNavSection">
              <span className="adminNavSectionTitle">{group.title}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`adminNavItem ${active ? 'adminNavItemActive' : ''}`}
                  >
                    <Icon size={17} style={{ flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{item.label}</span>
                      {item.desc ? <span className="adminNavSub">{item.desc}</span> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="adminSidebarFooter">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="adminNavItem"
            style={{ fontSize: 13, opacity: 0.8 }}
          >
            <ExternalLink size={15} />
            <span>Lihat Website Publik</span>
          </a>
          <form action={logout}>
            <button type="submit" className="adminLogoutBtn">
              <LogOut size={15} />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
