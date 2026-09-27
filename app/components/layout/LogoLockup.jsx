import { SITE_CONFIG } from '../../../lib/site-config';

export default function LogoLockup({ href = '/' }) {
  return (
    <a className="logoLockup" href={href} aria-label={`${SITE_CONFIG.name} home`}>
      <img
        src="/images/mti-wordmark.png"
        alt="Masyarakat Transportasi Indonesia"
        className="logoWordmarkImg"
      />
      <span className="logoDivider" aria-hidden="true" />
      <span className="logoRegionLockup">
        <strong>SUMATERA SELATAN</strong>
        <small>WILAYAH SUMSEL</small>
      </span>
    </a>
  );
}
