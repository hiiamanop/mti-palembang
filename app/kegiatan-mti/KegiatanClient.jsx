'use client';

import { useMemo, useState } from 'react';
import {
  filterKegiatanByYear,
  formatKegiatanDate,
  getKegiatanYears
} from '../../lib/kegiatan';

export default function KegiatanClient({ kegiatan }) {
  const [selectedYear, setSelectedYear] = useState('Semua');
  const years = useMemo(() => getKegiatanYears(kegiatan), [kegiatan]);
  const visible = useMemo(
    () => filterKegiatanByYear(kegiatan, selectedYear),
    [kegiatan, selectedYear]
  );

  return (
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
  );
}
