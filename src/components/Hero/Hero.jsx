import { useEffect, useState } from 'react';
import { ArrowRight, FileText, Mail, MapPin, RotateCcw } from 'lucide-react';
import { openResume } from '../../data/resumeData';
import { MOD_KEY } from '../../utils/platform';
import {
  CppIcon,
  CssIcon,
  HtmlIcon,
  JavaScriptIcon,
  PythonIcon,
  ReactIcon,
  SqlIcon,
  ViteIcon,
} from '../common/BrandIcons';
import { useSettings } from '../../context/SettingsContext';
import TechGlobe from './TechGlobe';
import './Hero.css';

const ROLES = ['Full-Stack Developer', 'Frontend Architecture', 'Python & AI Integrations', 'Embedded Systems'];

const ORBIT_SKILLS = [
  { name: 'React', Icon: ReactIcon },
  { name: 'JavaScript', Icon: JavaScriptIcon },
  { name: 'Python', Icon: PythonIcon },
  { name: 'HTML5', Icon: HtmlIcon },
  { name: 'CSS3', Icon: CssIcon },
  { name: 'Vite', Icon: ViteIcon },
  { name: 'C++', Icon: CppIcon },
  { name: 'SQL', Icon: SqlIcon },
];

function useTypewriter(words, { type = 85, erase = 45, hold = 1600 } = {}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let delay = deleting ? erase : type;
    if (!deleting && text === word) delay = hold;
    else if (deleting && text === '') delay = 350;

    const id = window.setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, index, words, type, erase, hold]);

  return text;
}

/* Each letter is its own span so it can wave in and bounce on hover. */
function SplitWord({ text, className = '', baseDelay = 0 }) {
  return (
    <span className={`split ${className}`} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="split__char"
          aria-hidden="true"
          style={{ '--i': i, '--d': `${baseDelay + i * 40}ms` }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
}

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Hero({ onOpenPalette }) {
  const typed = useTypewriter(ROLES);
  const [entryKey, setEntryKey] = useState(0);
  const { settings } = useSettings();
  const showGlobe = settings.heroVisual !== 'orbit';

  return (
    <section id="home" className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__badge">
            <span className="hero__badge-dot" />
            <span className="mono">Hello, World! I&apos;m</span>
          </p>

          <h1 className="hero__name">
            <SplitWord text="Karanam Selvakumar" className="hero__name-line" baseDelay={250} />
            <SplitWord text="Chaaruseelan" className="hero__name-line hero__name-main" baseDelay={600} />
          </h1>

          <p className="hero__tagline">
            CSE Student @ <strong>SRM Institute of Science and Technology</strong>, Chennai — crafting
            full-stack web experiences, AI integrations and clean, durable software.
          </p>

          <p className="hero__typer mono" aria-live="polite">
            <span className="hero__prompt">&gt;_</span>
            <span className="hero__typed">{typed}</span>
            <span className="hero__caret" aria-hidden="true" />
          </p>

          <div className="hero__ctas">
            <button type="button" className="btn btn-primary" data-magnetic onClick={() => scrollTo('projects')}>
              View Projects <ArrowRight size={18} />
            </button>
            <button type="button" className="btn btn-ghost" data-magnetic onClick={() => scrollTo('contact')}>
              Get In Touch <Mail size={18} />
            </button>
            <button type="button" className="btn btn-ghost hero__resume" data-magnetic onClick={openResume}>
              <FileText size={18} /> Resume
            </button>
          </div>

          <ul className="hero__meta mono">
            <li>
              <MapPin size={14} /> Chennai, India
            </li>
            <li>
              <span className="hero__status" /> Open to internships
            </li>
            <li className="hero__kbd-hint">
              <button type="button" onClick={onOpenPalette}>
                Press <kbd>{MOD_KEY} K</kbd> to explore
              </button>
            </li>
          </ul>
        </div>

        {showGlobe ? (
          <div className="hero__visual hero__visual--globe">
            <TechGlobe />
          </div>
        ) : (
        <div className="hero__visual" data-tilt="10">
          <div className="orbit" key={entryKey}>
            <div className="orbit__track orbit__track--outer" />
            <div className="orbit__track orbit__track--inner" />

            <div className="orbit__spinner">
              {ORBIT_SKILLS.map(({ name, Icon }, i) => (
                <div
                  key={name}
                  className="orbit__node"
                  style={{
                    '--angle': `${(360 / ORBIT_SKILLS.length) * i}deg`,
                    '--delay': `${120 + i * 180}ms`,
                  }}
                >
                  <div className="orbit__node-inner is-interactive" title={name}>
                    <Icon size={26} />
                    <span className="orbit__label mono">{name}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="orbit__center"
              onClick={() => setEntryKey((k) => k + 1)}
              aria-label="Replay orbit animation"
              title="Click to replay"
            >
              <span className="orbit__pulse" />
              <span className="orbit__pulse orbit__pulse--2" />
              <span className="monogram" aria-hidden="true">
                <svg className="monogram__rings" viewBox="0 0 200 200">
                  <circle className="monogram__ticks" cx="100" cy="100" r="84" pathLength="360" />
                  <circle className="monogram__arc" cx="100" cy="100" r="92" pathLength="360" />
                  <circle className="monogram__arc monogram__arc--2" cx="100" cy="100" r="92" pathLength="360" />
                </svg>
                <span className="monogram__core">
                  <span className="monogram__label mono">&lt;dev&gt;</span>
                  <span className="monogram__word">
                    KSCS<span className="monogram__dot">.</span>
                  </span>
                  <span className="monogram__label mono">full-stack</span>
                </span>
              </span>
              <span className="orbit__replay">
                <RotateCcw size={14} />
              </span>
            </button>
          </div>
        </div>
        )}
      </div>

      <button type="button" className="hero__scroll" onClick={() => scrollTo('about')} aria-label="Scroll to About">
        <span className="hero__mouse" />
        <span className="mono">SCROLL</span>
      </button>
    </section>
  );
}
