import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import ProfileLoader from './components/ProfileLoader/ProfileLoader';
import PointerEffect from './components/common/PointerEffect';
import ParticleField from './components/common/ParticleField';
import ScrollProgress from './components/common/ScrollProgress';
import CommandPalette from './components/common/CommandPalette';
import SettingsPanel from './components/common/SettingsPanel';
import Navbar from './components/Navbar/Navbar';
import BackToTop from './components/Navbar/BackToTop';
import Hero from './components/Hero/Hero';
import TechMarquee from './components/Hero/TechMarquee';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Certifications from './components/Certifications/Certifications';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { useSettings } from './context/SettingsContext';
import { useToast } from './context/ToastContext';
import useGlobalInteractions from './hooks/useGlobalInteractions';
import { sounds } from './utils/sound';

// Loaded on demand: the viewer pulls in PDF.js only when the resume is opened.
const ResumeViewer = lazy(() => import('./components/Resume/ResumeViewer'));

const SEEN_KEY = 'kscs-loader-seen';

function hasSeenLoader() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

const isTyping = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

export default function App() {
  const { settings, resolvedTheme, toggleTheme } = useSettings();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [quickLoad] = useState(hasSeenLoader);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeMounted, setResumeMounted] = useState(false);

  const fullMotion = settings.motion === 'full';
  useGlobalInteractions(ready && fullMotion);

  // Always start at the Hero on reload.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', loading);
  }, [loading]);

  // Remember where the last click happened so the theme reveal can grow from it.
  const lastPointer = useRef({ x: window.innerWidth - 60, y: 36 });
  useEffect(() => {
    const onDown = (e) => {
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  const handleToggleTheme = useCallback(() => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    if (document.startViewTransition && fullMotion) {
      const { x, y } = lastPointer.current;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const transition = document.startViewTransition(() => {
        flushSync(toggleTheme);
        document.documentElement.setAttribute('data-theme', next);
      });
      transition.ready
        .then(() =>
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
          ),
        )
        .catch(() => {});
    } else {
      toggleTheme();
    }
    toast(`${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode on`, { type: 'info', duration: 1600 });
  }, [toggleTheme, toast, resolvedTheme, fullMotion]);

  const openSettings = useCallback(() => {
    setPaletteOpen(false);
    setSettingsOpen(true);
  }, []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);

  useEffect(() => {
    const onOpen = () => {
      setPaletteOpen(false);
      setResumeMounted(true);
      setResumeOpen(true);
    };
    window.addEventListener('kscs:open-resume', onOpen);
    return () => window.removeEventListener('kscs:open-resume', onOpen);
  }, []);

  // Global keyboard shortcuts.
  useEffect(() => {
    if (!ready) return undefined;
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target) || paletteOpen || settingsOpen || resumeOpen) return;
      if (document.body.classList.contains('is-locked')) return;
      if (e.key === '/') {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key.toLowerCase() === 't') {
        handleToggleTheme();
      } else if (e.key.toLowerCase() === 's') {
        openSettings();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready, paletteOpen, settingsOpen, resumeOpen, handleToggleTheme, openSettings]);

  // Opt-in interface sounds.
  useEffect(() => {
    if (!settings.sound) return undefined;
    const onDown = (e) => {
      if (e.target instanceof Element && e.target.closest('a, button, [role="button"], label')) sounds.click();
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [settings.sound]);

  useEffect(() => {
    if (settings.sound && (paletteOpen || settingsOpen)) sounds.open();
  }, [paletteOpen, settingsOpen, settings.sound]);

  const handleFadeStart = useCallback(() => {
    window.scrollTo(0, 0);
    setReady(true);
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage unavailable */
    }
  }, []);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {settings.cursor && <PointerEffect />}
      {ready && settings.particles && fullMotion && <ParticleField key={`${settings.accent}-${resolvedTheme}`} />}
      {loading && (
        <ProfileLoader duration={quickLoad ? 1400 : 4500} onFadeStart={handleFadeStart} onComplete={handleComplete} />
      )}
      {ready && (
        <div className="app is-ready">
          <ScrollProgress />
          <Navbar
            theme={resolvedTheme}
            onToggleTheme={handleToggleTheme}
            onOpenSettings={openSettings}
            onOpenPalette={() => setPaletteOpen(true)}
          />
          <main>
            <Hero onOpenPalette={() => setPaletteOpen(true)} />
            <TechMarquee />
            <About />
            <Skills />
            <Projects />
            <Certifications />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
          <CommandPalette
            open={paletteOpen}
            onClose={closePalette}
            onOpenSettings={openSettings}
            onToggleTheme={handleToggleTheme}
            toast={toast}
          />
          <SettingsPanel open={settingsOpen} onClose={closeSettings} />
          {resumeMounted && (
            <Suspense fallback={null}>
              <ResumeViewer open={resumeOpen} onClose={closeResume} />
            </Suspense>
          )}
        </div>
      )}
    </>
  );
}
