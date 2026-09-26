import { SITE_CONFIG } from '../../../lib/site-config';

export default function LogoLockup({ href = '/' }) {
  return (
    <a className="logoLockup" href={href} aria-label={`${SITE_CONFIG.name} home`}>
      <img src={SITE_CONFIG.logo} alt="MTI" />
      <span className="logoFallback">MTI</span>
      <span>
        <strong>{SITE_CONFIG.name}</strong>
        <small>{SITE_CONFIG.fullName}</small>
        <small>{SITE_CONFIG.region}</small>
      </span>
    </a>
  );
}
