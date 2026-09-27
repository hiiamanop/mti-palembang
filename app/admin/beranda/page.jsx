import { getBeranda } from '../../../lib/cms';
import BerandaHub from './BerandaHub';

export const metadata = { title: 'Kelola Beranda - MTI CMS' };

export default async function AdminBerandaPage() {
  const beranda = await getBeranda();
  return <BerandaHub beranda={beranda} />;
}
