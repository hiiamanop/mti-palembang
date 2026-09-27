import { notFound } from 'next/navigation';
import { getKegiatanById } from '../../../../lib/cms';
import KegiatanEditorForm from '../KegiatanEditorForm';

export const metadata = { title: 'Edit Kegiatan - MTI CMS' };

export default async function AdminEditKegiatanPage({ params }) {
  const { id } = await params;
  const item = await getKegiatanById(id);
  if (!item) notFound();

  return <KegiatanEditorForm item={item} id={id} />;
}
