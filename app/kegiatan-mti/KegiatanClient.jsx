'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  filterKegiatanByYear,
  formatKegiatanDate,
  getKegiatanYears
} from '../../lib/kegiatan';
import { loadPreviewDraft } from '../../lib/preview-storage';
import PreviewBanner from '../components/shared/PreviewBanner';

export default function KegiatanClient({ kegiatan: initialKegiatan }) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  const [items, setItems] = useState(initialKegiatan);

  useEffect(() => {
    if (isPreview) {
      const draft = loadPreviewDraft('kegiatan');
      if (draft && draft.title) {
        setItems((prev) => {
          const filtered = prev.filter((i) => i.id !== draft.id);
          return [draft, ...filtered];
        });
      }
    }
  }, [isPreview]);

  const [selectedYear, setSelectedYear] = useState('Semua');
  const years = useMemo(() => getKegiatanYears(items), [items]);
  const visible = useMemo(
    () => filterKegiatanByYear(items, selectedYear),
    [items, selectedYear]
  );

  return (
    <>
      {isPreview ? <PreviewBanner /> : null}

      <section className="wideShell kegiatanContent">
        <div className="kegiatanTabs" role="tablist" aria-label="Filter kegiatan berdasarkan tahun">
          {['Semua', ...years].map((year) => (
            <button
              key={year}
              type="button"
              role="tab"
              aria-selected={selectedYear === year}
              className={selectedYear === year ? 'active' : ''}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        {visible.length ? (
          <div className="kegiatanGrid">
            {visible.map((item) => (
              <article className="kegiatanCard" key={item.id}>
                {item.image ? <img src={item.image} alt="" /> : null}
                <div>
                  <time dateTime={item.date}>{formatKegiatanDate(item.date)}</time>
                  <h2>{item.title}</h2>
                  {item.summary ? <p>{item.summary}</p> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="kegiatanEmpty">Belum ada kegiatan yang dipublikasikan.</p>
        )}
      </section>
    </>
  );
}
