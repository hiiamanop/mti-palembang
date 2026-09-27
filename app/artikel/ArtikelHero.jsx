'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadPreviewDraft } from '../../lib/preview-storage';

export default function ArtikelHero({ savedHero = {} }) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isPreview) setPreview(loadPreviewDraft('artikelHero'));
  }, [isPreview]);

  const hero = preview || savedHero;
  const title = hero.title || 'Artikel & Opini Transportasi';
  const description = hero.description || 'Kajian mendalam, analisis kebijakan, dan perspektif kritis para pakar Masyarakat Transportasi Indonesia Wilayah Sumatera Selatan.';
  const image = hero.image || 'https://mti.or.id/wp-content/uploads/2023/07/Screenshot-2023-07-01-at-17.28.41.png';

  return (
    <section className="dialogHero">
      <img src={image} alt="" aria-hidden="true" />
      <span className="dialogHeroShade" />
      <div className="wideShell dialogHeroContent">
        <span className="dialogEyebrow">Artikel &amp; Opini</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
