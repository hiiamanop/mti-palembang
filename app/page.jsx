import { getBerita, getBeranda, getMedia } from '../lib/cms';
import HomeClient from './HomeClient';

export default async function Home() {
  const [beritaAll, beranda, media] = await Promise.all([
    getBerita(),
    getBeranda(),
    getMedia()
  ]);

  // Only show published berita on homepage
  const beritaItems = beritaAll.filter((b) => b.published);

  return (
    <HomeClient
      beritaItems={beritaItems}
      tickerItems={beranda.ticker || []}
      heroSide={beranda.heroSide || []}
      leadStory={beranda.leadStory || null}
      mediaData={media}
      aboutSumsel={beranda.aboutSumsel || null}
      fokusIsu={beranda.fokusIsu || []}
    />
  );
}
