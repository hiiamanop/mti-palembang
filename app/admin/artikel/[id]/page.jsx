import { notFound } from 'next/navigation';
import { getArtikelById } from '../../../../lib/cms';
import ArtikelEditorForm from '../ArtikelEditorForm';

export const metadata = { title: 'Edit Artikel - MTI CMS' };

export default async function AdminEditArtikelPage({ params }) {
  const { id } = await params;
  const item = await getArtikelById(id);
  if (!item) notFound();

  return <ArtikelEditorForm item={item} id={id} />;
}
