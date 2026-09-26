'use client';

import { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../../../lib/site-config';

function formatDate(date) {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function UtilityBar() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const dateText = now ? formatDate(now) : 'Sabtu, 26 September 2026';
  const timeText = now ? formatTime(now) : '17.00';

  return (
    <div className="utilityBar">
      <div className="wideShell utilityInner">
        <div className="utilityLeft">
          <span className="liveDot" />
          <strong>{dateText}</strong>
          <span className="divider">.</span>
          <span>{timeText} WIB</span>
        </div>
        <div className="utilityRight">
          <span>{SITE_CONFIG.email}</span>
          <a href={SITE_CONFIG.socials.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={SITE_CONFIG.socials.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={SITE_CONFIG.socials.twitter} target="_blank" rel="noopener noreferrer">
            X
          </a>
          <strong>ID</strong>
          <span>EN</span>
        </div>
      </div>
    </div>
  );
}
