import AdminSidebar from './AdminSidebar';
import { createClient } from '../../lib/supabase/server';

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const authed = !!user;

  return (
    <div className="adminWrap">
      {authed && <AdminSidebar />}
      <main className="adminMain">{children}</main>
    </div>
  );
}
