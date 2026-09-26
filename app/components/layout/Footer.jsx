import { SITE_CONFIG } from '../../../lib/site-config';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wideShell footerGrid">
        <div>
          <div className="footerBrand">
            <img src={SITE_CONFIG.logo} alt="MTI" />
            <span>
              <strong>{SITE_CONFIG.name}</strong>
              <small>{SITE_CONFIG.fullName}</small>
            </span>
          </div>
          <p>{SITE_CONFIG.description}</p>
          <p className="address">{SITE_CONFIG.address}</p>
          <div className="socials">
            <a href={SITE_CONFIG.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              in
            </a>
            <a href={SITE_CONFIG.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              IG
            </a>
            <a href={SITE_CONFIG.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="X">
              X
            </a>
            <a href={SITE_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              f
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
