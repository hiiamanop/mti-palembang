'use client';

import { useState } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import UtilityBar from './UtilityBar';
import LogoLockup from './LogoLockup';
import { SITE_CONFIG } from '../../../lib/site-config';

function isItemActive(item, activeItem) {
  if (!activeItem) return false;
  if (item.label === activeItem) return true;
  if (!item.children) return false;
  return item.children.some(
    (c) => c.label === activeItem || c.children?.some((s) => s.label === activeItem)
  );
}

export default function Header({
  activeItem,
  editionTitle = 'EDISI HARI INI',
  editionSubtitle = 'Wisma Nugra Santana, Jakarta'
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubLabel, setOpenSubLabel] = useState(null);

  return (
    <>
      <div className="topGradient" />
      <UtilityBar />

      <section className="masthead">
        <div className="wideShell mastheadInner">
          <div className="editionMeta">
            <span>{editionTitle}</span>
            <p>{editionSubtitle}</p>
          </div>

          <LogoLockup href="/" />

          <div className="mastheadTools">
            <button className="iconButton" type="button" aria-label="Cari">
              <Search size={18} aria-hidden="true" />
            </button>
            <a className="subscribeButton desktopOnly" href="/#newsletter">
              Berlangganan
            </a>
            <button
              className="iconButton mobileOnly"
              type="button"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              onClick={() => {
                setMobileOpen((value) => !value);
                setOpenDropdown(null);
              }}
            >
              {mobileOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </section>

      <header className="navStrip">
        <div className="wideShell navInner">
          <nav
            className="desktopNav"
            aria-label="Navigasi utama"
            onMouseLeave={() => {
              setOpenDropdown(null);
              setOpenSubLabel(null);
            }}
          >
            {SITE_CONFIG.navItems.map((item, index) => {
              const active = isItemActive(item, activeItem);
              return (
                <div
                  className="navItem"
                  key={item.label}
                  onMouseEnter={() => {
                    setOpenDropdown(index);
                    setOpenSubLabel(null);
                  }}
                >
                  <a className={active ? 'active' : ''} href={item.href}>
                    {item.badge ? <span className="navBadge" /> : null}
                    {item.label}
                    {item.children ? <ChevronDown size={12} aria-hidden="true" /> : null}
                  </a>
                  {item.children && openDropdown === index ? (
                    <div className="dropdownPanel">
                      {item.children.map((child) => (
                        <div
                          className="navDropItem"
                          key={child.label || child}
                          onMouseEnter={() => setOpenSubLabel(child.label || child)}
                        >
                          <a href={child.href || '#'}>
                            <span />
                            {child.label || child}
                            {child.children ? <ChevronDown size={11} aria-hidden="true" /> : null}
                          </a>
                          {child.children && openSubLabel === (child.label || child) ? (
                            <div className="navSubDropdown">
                              {child.children.map((sub) => (
                                <a key={sub.label} href={sub.href || '#'}>
                                  {sub.label}
                                </a>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>

        {mobileOpen ? (
          <nav className="mobileNav" aria-label="Navigasi mobile">
            {SITE_CONFIG.navItems.map((item, index) => (
              <div className="mobileNavGroup" key={item.label}>
                {item.children ? (
                  <button
                    type="button"
                    onClick={() => setOpenDropdown((value) => (value === index ? null : index))}
                  >
                    {item.label}
                    <ChevronDown size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <a href={item.href || '#'} onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </a>
                )}
                {item.children && openDropdown === index ? (
                  <div className="mobileSubmenu">
                    {item.children.map((child) => (
                      <a
                        href={child.href || '#'}
                        key={child.label || child}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label || child}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <a className="mobileSubscribe" href="/#newsletter" onClick={() => setMobileOpen(false)}>
              Berlangganan Newsletter
            </a>
          </nav>
        ) : null}
      </header>
    </>
  );
}
