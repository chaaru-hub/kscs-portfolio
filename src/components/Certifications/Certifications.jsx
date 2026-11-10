import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, BadgeCheck, ExternalLink, Maximize2, X } from 'lucide-react';
import Reveal from '../common/Reveal';
import ScrambleText from '../common/ScrambleText';
import useScrollLock from '../../hooks/useScrollLock';
import useInView from '../../hooks/useInView';
import { CERTIFICATIONS } from '../../data/certificationsData';
import './Certifications.css';

/* Rendered certificate preview used until a real scan is supplied. */
function CertificateArt({ cert }) {
  return (
    <div className="cert-art" style={{ '--a1': cert.accent, '--a2': cert.accent2 }}>
      <div className="cert-art__frame">
        <span className="cert-art__seal">
          <Award size={26} />
        </span>
        <span className="cert-art__ribbon mono">Preview</span>
        <p className="cert-art__kicker mono">{cert.type}</p>
        <p className="cert-art__presented mono">presented to</p>
        <p className="cert-art__name">Karanam Selvakumar Chaaruseelan</p>
        <p className="cert-art__for">for participating in</p>
        <p className="cert-art__event">{cert.title}</p>
        <div className="cert-art__foot mono">
          <span>{cert.issuer}</span>
          <span>{cert.date}</span>
        </div>
      </div>
    </div>
  );
}

function CertVisual({ cert }) {
  const [failed, setFailed] = useState(false);
  if (cert.image && !failed) {
    return <img className="cert-img" src={cert.image} alt={`${cert.title} certificate`} onError={() => setFailed(true)} />;
  }
  return <CertificateArt cert={cert} />;
}

function Lightbox({ cert, onClose }) {
  const closeRef = useRef(null);
  useScrollLock(!!cert, onClose);
  useEffect(() => {
    if (cert) closeRef.current?.focus();
  }, [cert]);
  if (!cert) return null;

  return createPortal(
    <div className="lightbox" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <figure className="lightbox__figure" role="dialog" aria-modal="true" aria-label={cert.title}>
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close preview" ref={closeRef}>
          <X size={20} />
        </button>
        <div className="lightbox__media">
          <CertVisual cert={cert} />
        </div>
        <figcaption className="lightbox__caption">
          <div>
            <strong>{cert.title}</strong>
            <span className="mono">
              {cert.issuer} · {cert.date}
            </span>
          </div>
          <div className="lightbox__actions">
            {cert.image && (
              <a className="btn btn-ghost btn-sm" href={cert.image} target="_blank" rel="noopener noreferrer">
                <Maximize2 size={14} /> Full size
              </a>
            )}
            <a className="btn btn-primary btn-sm" href={cert.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} /> Visit issuer
            </a>
          </div>
        </figcaption>
        <p className="lightbox__hint mono">Press Esc to close</p>
      </figure>
    </div>,
    document.body,
  );
}

const SWAP_LOCK_MS = 650;

export default function Certifications() {
  const [preview, setPreview] = useState(null);
  const closePreview = useCallback(() => setPreview(null), []);
  const n = CERTIFICATIONS.length;
  const mid = (n - 1) / 2;
  const [active, setActive] = useState(Math.floor(mid));
  const [pouchRef, opened] = useInView({ threshold: 0.35 });
  // After a swap the cards move under a still pointer; ignore hovers until they settle.
  const locked = useRef(false);
  const lockTimer = useRef(0);
  const pending = useRef(null); // card hovered while locked; applied when the lock ends
  // Mirrors `active` for the lock timer; bringToFront is the only writer of both.
  const activeRef = useRef(active);
  useEffect(() => () => clearTimeout(lockTimer.current), []);

  const [settled, setSettled] = useState(false);

  // The opening animation staggers each card; afterwards swaps should respond at once.
  useEffect(() => {
    if (!opened) return undefined;
    const id = window.setTimeout(() => setSettled(true), 1700);
    return () => clearTimeout(id);
  }, [opened]);

  const bringToFront = (i) => {
    if (i === activeRef.current) return;
    locked.current = true;
    pending.current = null;
    clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => {
      locked.current = false;
      const next = pending.current;
      pending.current = null;
      if (next !== null && next !== activeRef.current) bringToFront(next);
    }, SWAP_LOCK_MS);
    activeRef.current = i;
    setActive(i);
  };

  const onCardPointerMove = (e, i) => {
    if (e.pointerType !== 'mouse') return;
    if (locked.current) {
      // Remember only real pointer movement, so a still cursor never swaps cards back and forth.
      pending.current = i;
      return;
    }
    bringToFront(i);
  };

  return (
    <section id="certifications" className="section certs">
      <div className="container">
        <Reveal className="section-head">
          <p className="section-tag">
            <ScrambleText text="Verified Credentials" />
          </p>
          <h2 className="section-title">
            Proof of <span className="text-gradient">building under pressure</span>.
          </h2>
          <p className="section-sub">Hackathons where ideas had hours, not months, to become working software.</p>
        </Reveal>

        <div ref={pouchRef} className={`pouch ${opened ? 'is-open' : ''} ${settled ? 'is-settled' : ''}`} style={{ '--n': n }}>
          <div className="pouch__back" aria-hidden="true">
            <span className="pouch__flap" />
          </div>

          <div className="pouch__cards">
            {CERTIFICATIONS.map((c, i) => {
              const isActive = i === active;
              const k = i - mid;
              return (
                // Hover is a mouse shortcut; the band button handles click, tap and keyboard focus.
                <div
                  key={c.id}
                  className={`pcert ${isActive ? 'is-active' : ''}`}
                  style={{
                    '--k': k,
                    '--i': i,
                    '--depth': Math.abs(k),
                    '--a1': c.accent,
                    '--a2': c.accent2,
                  }}
                  onPointerMove={(e) => onCardPointerMove(e, i)}
                  // Touch: a tap anywhere on a card's visible strip brings it forward
                  // (a scroll gesture ends in pointercancel, not pointerup).
                  onPointerUp={(e) => e.pointerType !== 'mouse' && bringToFront(i)}
                >
                  <button
                    type="button"
                    className="pcert__band"
                    onClick={() => bringToFront(i)}
                    onFocus={() => bringToFront(i)}
                    aria-pressed={isActive}
                  >
                    <span className="pcert__dot" aria-hidden="true" />
                    <span className="pcert__heading">
                      <strong>{c.title}</strong>
                      <span className="mono">
                        {c.issuer} · {c.date}
                      </span>
                    </span>
                    <BadgeCheck size={16} className="pcert__check" aria-label="Verified" />
                  </button>

                  <button
                    type="button"
                    className="pcert__visual"
                    onClick={() => (isActive ? setPreview(c) : bringToFront(i))}
                    aria-label={isActive ? `Open ${c.title} certificate` : `Show ${c.title}`}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <CertVisual cert={c} />
                    <span className="pcert__zoom">
                      <Maximize2 size={14} /> View
                    </span>
                  </button>

                  <div className="pcert__info" inert={!isActive}>
                    <p className="pcert__type mono">{c.type}</p>
                    <p className="pcert__desc">{c.description}</p>
                    <div className="pcert__actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setPreview(c)}>
                        <Maximize2 size={14} /> Preview
                      </button>
                      <a className="btn btn-ghost btn-sm" href={c.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} /> Issuer
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pouch__front" aria-hidden="true">
            <span className="pouch__stitch" />
            <span className="pouch__label mono">KSCS · CREDENTIALS</span>
            <span className="pouch__count mono">
              {n} VERIFIED
            </span>
          </div>
        </div>
        <p className="pouch__hint mono">
          <span className="pouch__hint-mouse">hover a certificate to bring it to the front</span>
          <span className="pouch__hint-touch">tap a certificate to bring it to the front</span>
        </p>
      </div>
      <Lightbox cert={preview} onClose={closePreview} />
    </section>
  );
}
