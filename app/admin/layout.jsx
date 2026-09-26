import Link from 'next/link';
import { logout } from './actions';
import { createClient } from '../../lib/supabase/server';

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const authed = !!user;

  return (
    <div className="adminWrap">
      {authed && (
        <aside className="adminSidebar">
          <div className="adminSidebarBrand">
            <strong>MTI CMS</strong>
            <small>Admin Panel</small>
          </div>
          <nav className="adminSidebarNav">
            <Link href="/admin" className="adminNavItem">Dashboard</Link>
            <Link href="/admin/beranda" className="adminNavItem">Beranda</Link>
            <Link href="/admin/berita" className="adminNavItem">Berita</Link>
            <Link href="/admin/kegiatan" className="adminNavItem">Kegiatan MTI</Link>
            <Link href="/admin/struktur-organisasi" className="adminNavItem">Struktur Organisasi</Link>
            <Link href="/admin/media" className="adminNavItem">Media</Link>
            <Link href="/admin/jurnal" className="adminNavItem">Jurnal</Link>
            <Link href="/admin/artikel" className="adminNavItem">Artikel &amp; Opini</Link>
          </nav>
          <div className="adminSidebarFooter">
            <a href="/" className="adminNavItem" style={{ fontSize: 12, opacity: 0.7 }}>
              Lihat Website
            </a>
            <form action={logout}>
              <button type="submit" className="adminLogoutBtn">Keluar</button>
            </form>
          </div>
        </aside>
      )}
      <main className="adminMain">{children}</main>
    </div>
  );
}
