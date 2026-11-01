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
  const [active, setActive] = useState(null);
  const close = useCallback(() => setActive(null), []);

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

        <div className="certs__grid">
          {CERTIFICATIONS.map((c, i) => (
            <Reveal key={c.id} delay={i * 140}>
              <article className="cert glass spotlight" data-tilt="5" style={{ '--a1': c.accent, '--a2': c.accent2 }}>
                <button
                  type="button"
                  className="cert__preview"
                  onClick={() => setActive(c)}
                  aria-label={`Open ${c.title} certificate`}
                >
                  <CertVisual cert={c} />
                  <span className="cert__zoom">
                    <Maximize2 size={18} /> View
                  </span>
                </button>
                <div className="cert__body">
                  <div className="cert__meta mono">
                    <span className="cert__verified">
                      <BadgeCheck size={14} /> Verified
                    </span>
                    <span>{c.date}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p className="cert__issuer mono">
                    {c.issuer} · {c.type}
                  </p>
                  {c.credentialId && <p className="cert__id mono">Credential ID: {c.credentialId}</p>}
                  <p className="cert__desc">{c.description}</p>
                  <ul className="cert__tags">
                    {c.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="cert__actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setActive(c)}>
                      <Maximize2 size={14} /> Preview
                    </button>
                    <a className="btn btn-ghost btn-sm" href={c.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} /> Issuer
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox cert={active} onClose={close} />
    </section>
  );
}
