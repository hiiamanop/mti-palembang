import { SITE_CONFIG } from '../../../lib/site-config';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wideShell footerGrid">
        <div>
          <div className="footerBrand">
            <img src={SITE_CONFIG.logoEmblem || SITE_CONFIG.logo} alt="MTI" />
            <span>
              <strong>{SITE_CONFIG.name}</strong>
              <small>{SITE_CONFIG.fullName}</small>
              <small>{SITE_CONFIG.region}</small>
            </span>
          </div>
          <p>{SITE_CONFIG.description}</p>
          <div className="socials">
            <a
              href={SITE_CONFIG.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a
              href={SITE_CONFIG.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href={SITE_CONFIG.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={SITE_CONFIG.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </a>
          </div>
        </div>

        {SITE_CONFIG.footerLinks.map((col) => (
          <div className="footerLinks" key={col.title}>
            <h3>{col.title}</h3>
            {col.items.map((item) => (
              <a href={item.href} key={item.label}>
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="footerBottom">
        <div className="wideShell">
          <span>
            Masyarakat Transportasi Indonesia &copy; {new Date().getFullYear()}. All rights reserved.
          </span>
          <span>
            <a href="/#">Kebijakan Privasi</a>
            <a href={`mailto:${SITE_CONFIG.email}`}>Kontak</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
