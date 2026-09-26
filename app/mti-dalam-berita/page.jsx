import { permanentRedirect } from 'next/navigation';

export default function LegacyKegiatanPage() {
  permanentRedirect('/kegiatan-mti');
}
