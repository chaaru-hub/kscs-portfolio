import { useEffect, useState } from 'react';
import { Menu, Moon, Search, Settings2, Sun, X } from 'lucide-react';
import { MOD_KEY } from '../../utils/platform';
import './Navbar.css';

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ theme, onToggleTheme, onOpenSettings, onOpenPalette }) {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll spy: the section crossing the upper third of the viewport wins.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <nav className="navbar__inner container" aria-label="Primary">
        <a href="#home" className="navbar__logo" onClick={(e) => go(e, 'home')} aria-label="KSCS home">
          <span className="navbar__logo-mark">KSCS</span>
          <span className="navbar__logo-dot">.</span>
        </a>

        <ul className="navbar__links">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={active === l.id ? 'is-active' : ''}
                aria-current={active === l.id ? 'page' : undefined}
                onClick={(e) => go(e, l.id)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <button type="button" className="navbar__search" onClick={onOpenPalette} aria-label="Open command palette" data-magnetic>
            <Search size={15} />
            <span>Search</span>
            <kbd>{MOD_KEY} K</kbd>
          </button>
          <button
            type="button"
            className="navbar__icon-btn"
            data-magnetic
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title="Toggle theme"
          >
            <span className={`theme-icon ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
              <Sun size={18} className="theme-icon__sun" />
              <Moon size={18} className="theme-icon__moon" />
            </span>
          </button>
          <button
            type="button"
            className="navbar__icon-btn navbar__gear"
            data-magnetic
            onClick={onOpenSettings}
            aria-label="Open settings"
            title="Settings (S)"
          >
            <Settings2 size={18} />
          </button>
          <button
            type="button"
            className="navbar__icon-btn navbar__burger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>

      <div className={`drawer-backdrop ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="mobile-drawer" className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <p className="drawer__tag mono">{'// NAVIGATION'}</p>
        <ul>
          {NAV_LINKS.map((l, i) => (
            <li key={l.id} style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}>
              <a
                href={`#${l.id}`}
                className={active === l.id ? 'is-active' : ''}
                onClick={(e) => go(e, l.id)}
                tabIndex={open ? 0 : -1}
              >
                <span className="mono">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="drawer__tools">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false);
              onOpenPalette();
            }}
          >
            <Search size={15} /> Search
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false);
              onOpenSettings();
            }}
          >
            <Settings2 size={15} /> Settings
          </button>
        </div>
        <p className="drawer__foot mono">chaaruseelan8@gmail.com</p>
      </aside>
    </>
  );
}
