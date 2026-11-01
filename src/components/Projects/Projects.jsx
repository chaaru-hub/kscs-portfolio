import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Code2, FileText, MousePointer2, RotateCw } from 'lucide-react';
import Reveal from '../common/Reveal';
import ScrambleText from '../common/ScrambleText';
import { GithubIcon } from '../common/BrandIcons';
import { PROJECTS } from '../../data/projectsData';
import ProjectModal from './ProjectModal';
import ProjectVisual from './ProjectVisual';
import { reserveFrames } from '../../utils/motionBudget';
import './Projects.css';

function ProjectCard({ project, index, onOpen }) {
  const [open, setOpen] = useState(false);
  // Bumped on every opening so the mock screen remounts and replays its animation.
  const [openCount, setOpenCount] = useState(0);
  const backRef = useRef(null);
  const mountTimer = useRef(0);

  useEffect(() => () => clearTimeout(mountTimer.current), []);

  const show = () => {
    setOpen(true);
    reserveFrames(1000);
    // Mount the mock screen once the card is about halfway round, not at the start of the turn.
    clearTimeout(mountTimer.current);
    mountTimer.current = window.setTimeout(() => setOpenCount((c) => c + 1), 420);
  };

  const hide = () => {
    clearTimeout(mountTimer.current);
    reserveFrames(1000);
    setOpen(false);
  };

  // Keyboard users: move focus onto the back face once it has turned.
  const openWithKeyboard = () => {
    show();
    window.setTimeout(() => backRef.current?.querySelector('a, button')?.focus(), 450);
  };

  return (
    <div
      className={`pslot ${open ? 'is-open' : ''}`}
      style={{ '--accent': project.accent, '--gradient': project.gradient, '--i': index }}
      // Only a real mouse leaving closes it; touch fires a synthetic leave right after a tap.
      onPointerEnter={(e) => e.pointerType === 'mouse' && show()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && hide()}
    >
      <div className="pcard">
        <div className="pcard__inner">
          {/* FRONT */}
          <div className="pcard__face pcard__front" aria-hidden={open}>
            <div className="pcard__banner">
              <span className="pcard__num mono">0{index + 1}</span>
              <span className="pcard__badge mono">{project.category}</span>
              <div className="pcard__glyph" aria-hidden="true">
                <Code2 size={64} strokeWidth={1.2} />
              </div>
              <span className="pcard__grid" aria-hidden="true" />
            </div>
            <div className="pcard__body">
              <h3 className="pcard__title">{project.title}</h3>
              <p className="pcard__subtitle">{project.subtitle}</p>
              <ul className="pcard__chips">
                {project.stack.slice(0, 3).map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
                {project.stack.length > 3 && <li className="chip">+{project.stack.length - 3}</li>}
              </ul>
            </div>
            <div className="pcard__bar">
              <span className="pcard__hint mono">
                <MousePointer2 size={13} />
                <span className="pcard__hint-mouse">Hover to explore</span>
                <span className="pcard__hint-touch">Tap Details to explore</span>
              </span>
              <button type="button" className="pcard__flip-btn" onClick={openWithKeyboard} tabIndex={open ? -1 : 0}>
                Details <RotateCw size={14} />
              </button>
            </div>
          </div>

          {/* BACK */}
          <div className="pcard__face pcard__back" aria-hidden={!open} ref={backRef}>
            <div className="pcard__visual">
              {openCount > 0 && <ProjectVisual key={openCount} id={project.id} />}
              <button
                type="button"
                className="pcard__close"
                onClick={hide}
                aria-label="Flip card back"
                tabIndex={open ? 0 : -1}
              >
                <RotateCw size={14} />
              </button>
            </div>

            <div className="pcard__back-body">
            <div className="pcard__back-head">
              <span className="pcard__back-badge mono">
                0{index + 1} · {project.category}
              </span>
              <span className="pcard__caption mono">Illustrative interface</span>
            </div>

            <h3 className="pcard__back-title">{project.title}</h3>
            <p className="pcard__summary">{project.summary}</p>

            <ul className="pcard__highlights">
              {project.highlights.map((h, i) => (
                <li key={h} style={{ '--d': `${320 + i * 70}ms` }}>
                  <CheckCircle2 size={15} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <ul className="pcard__chips pcard__chips--back">
              {project.stack.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>

            <div className="pcard__actions">
              <a
                className="btn btn-ghost btn-sm"
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
              >
                <GithubIcon size={15} /> Repository
              </a>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={(e) => onOpen(project, e.currentTarget)}
                tabIndex={open ? 0 : -1}
              >
                <FileText size={15} /> Case study
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState(null);
  const [returnFocus, setReturnFocus] = useState(null);

  const open = useCallback((project, trigger) => {
    setReturnFocus(trigger);
    setActive(project);
  }, []);

  // Deep-link from the command palette.
  useEffect(() => {
    const onOpen = (e) => {
      const project = PROJECTS.find((p) => p.id === e.detail);
      if (!project) return;
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      setReturnFocus(document.activeElement);
      setActive(project);
    };
    window.addEventListener('kscs:open-project', onOpen);
    return () => window.removeEventListener('kscs:open-project', onOpen);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    returnFocus?.focus?.();
  }, [returnFocus]);

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <Reveal className="section-head">
          <p className="section-tag">
            <ScrambleText text="Featured Projects" />
          </p>
          <h2 className="section-title">
            Built to <span className="text-gradient">solve real problems</span>.
          </h2>
          <p className="section-sub">
            Point at a card to flip it open, then read the case study for the full architecture breakdown.
          </p>
        </Reveal>

        <Reveal className="projects__grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={open} />
          ))}
        </Reveal>

        <Reveal className="projects__more">
          <a className="btn btn-ghost" data-magnetic href="https://github.com/chaaru-hub" target="_blank" rel="noopener noreferrer">
            <GithubIcon size={18} /> More on GitHub <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>

      <ProjectModal project={active} onClose={close} />
    </section>
  );
}
