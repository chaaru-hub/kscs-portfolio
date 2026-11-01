import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Cpu, Layers, Target, X } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import useScrollLock from '../../hooks/useScrollLock';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  useScrollLock(!!project, onClose);

  useEffect(() => {
    if (project) dialogRef.current?.focus();
  }, [project]);

  if (!project) return null;

  return createPortal(
    <div className="pmodal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="pmodal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pmodal-title"
        tabIndex={-1}
        ref={dialogRef}
        style={{ '--gradient': project.gradient, '--accent': project.accent }}
      >
        <header className="pmodal__hero">
          <span className="pmodal__grid" aria-hidden="true" />
          <button type="button" className="pmodal__close" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
          <span className="pmodal__badge mono">
            {project.category} · {project.year}
          </span>
          <h3 id="pmodal-title">{project.title}</h3>
          <p>{project.subtitle}</p>
        </header>

        <div className="pmodal__body">
          <section className="pmodal__block">
            <h4>
              <AlertTriangle size={16} /> Problem Statement
            </h4>
            <p>{project.problem}</p>
          </section>
          <section className="pmodal__block">
            <h4>
              <Target size={16} /> Purpose
            </h4>
            <p>{project.purpose}</p>
          </section>
          <section className="pmodal__block">
            <h4>
              <Cpu size={16} /> Architecture &amp; Features
            </h4>
            <ul className="pmodal__list">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
          <section className="pmodal__block">
            <h4>
              <Layers size={16} /> Tech Stack
            </h4>
            <ul className="pmodal__stack">
              {project.stack.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="pmodal__foot">
          <a className="btn btn-primary" href={project.repo} target="_blank" rel="noopener noreferrer">
            <GithubIcon size={17} /> View Repository
          </a>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
