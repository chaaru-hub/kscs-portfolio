import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, BadgeCheck, ExternalLink, Maximize2, X } from 'lucide-react';
import Reveal from '../common/Reveal';
import ScrambleText from '../common/ScrambleText';
import useScrollLock from '../../hooks/useScrollLock';
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

export default function Certifications() {
  const [preview, setPreview] = useState(null);
  const closePreview = useCallback(() => setPreview(null), []);
  const last = CERTIFICATIONS.length - 1;
  // One card is open at a time; at rest it is the last (front) card, as in a fanned deck.
  const [open, setOpen] = useState(last);

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

        <Reveal>
          <div
            className="cstack"
            style={{ '--n': CERTIFICATIONS.length }}
            // Mouse only: touch browsers fire a synthetic leave right after a tap.
            onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(last)}
          >
            {CERTIFICATIONS.map((c, i) => {
              const isOpen = open === i;
              return (
                // Hover is a shortcut for the band button below, which handles click, tap and focus.
                <div
                  key={c.id}
                  className={`cstack__card ${isOpen ? 'is-open' : ''} ${i > open ? 'is-below' : ''}`}
                  style={{ '--i': i, '--a1': c.accent, '--a2': c.accent2, '--mix': `${10 + i * 9}%` }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(i)}
                >
                  <button
                    type="button"
                    className="cstack__band"
                    onClick={() => setOpen(i)}
                    onFocus={() => setOpen(i)}
                    aria-expanded={isOpen}
                    aria-controls={`cert-body-${c.id}`}
                  >
                    <span className="cstack__num mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cstack__dot" aria-hidden="true" />
                    <span className="cstack__heading">
                      <strong>{c.title}</strong>
                      <span className="mono">
                        {c.issuer} · {c.date}
                      </span>
                    </span>
                    <span className="cstack__verified mono">
                      <BadgeCheck size={14} /> Verified
                    </span>
                  </button>

                  <div className="cstack__body" id={`cert-body-${c.id}`} inert={!isOpen}>
                    <button
                      type="button"
                      className="cstack__visual"
                      onClick={() => setPreview(c)}
                      aria-label={`Open ${c.title} certificate`}
                    >
                      <CertVisual cert={c} />
                      <span className="cstack__zoom">
                        <Maximize2 size={16} /> View
                      </span>
                    </button>

                    <div className="cstack__info">
                      <p className="cstack__type mono">{c.type}</p>
                      {c.credentialId && <p className="cstack__id mono">Credential ID: {c.credentialId}</p>}
                      <p className="cstack__desc">{c.description}</p>
                      <ul className="cstack__tags">
                        {c.tags.map((t) => (
                          <li key={t} className="chip">
                            {t}
                          </li>
                        ))}
                      </ul>
                      <div className="cstack__actions">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => setPreview(c)}>
                          <Maximize2 size={14} /> Preview
                        </button>
                        <a className="btn btn-ghost btn-sm" href={c.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={14} /> Issuer
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="cstack__hint mono">hover or tap a certificate to slide it out</p>
        </Reveal>
      </div>
      <Lightbox cert={preview} onClose={closePreview} />
    </section>
  );
}
