import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, ExternalLink, Maximize2, X } from 'lucide-react';
import Reveal from '../common/Reveal';
import ScrambleText from '../common/ScrambleText';
import useScrollLock from '../../hooks/useScrollLock';
import useInView from '../../hooks/useInView';
import FolderFloat from '../common/FolderFloat/FolderFloat';
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

// After a tap opens the lightbox, the browser's delayed compatibility mousedown lands on the
// new backdrop; ignore backdrop presses this soon after opening so it doesn't close at once.
const BACKDROP_GRACE_MS = 450;

function Lightbox({ cert, onClose }) {
  const closeRef = useRef(null);
  const openedAt = useRef(0);
  useScrollLock(!!cert, onClose);
  useEffect(() => {
    if (!cert) return;
    openedAt.current = performance.now();
    closeRef.current?.focus();
  }, [cert]);
  if (!cert) return null;

  const onBackdrop = (e) => {
    if (e.target !== e.currentTarget || e.timeStamp - openedAt.current < BACKDROP_GRACE_MS) return;
    onClose();
  };

  return createPortal(
    <div className="lightbox" role="presentation" onMouseDown={onBackdrop}>
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

// Folder colours from the deep-green palette the site's accent sits in.
const FOLDER_COLORS = {
  folderColor: '#0B2B26',
  frontColor: '#235347',
  paperColor: '#DAF1DE',
  itemColor: '#DAF1DE',
  itemTextColor: '#051F20',
  labelColor: '#DAF1DE',
};

// Each pill is the certificate photo; the title stays as its accessible name.
const PILLS = CERTIFICATIONS.map((c) => ({
  label: `${c.title} certificate`,
  value: c.id,
  content: (
    <img
      className="credfolder__thumb"
      src={c.image}
      width={c.imageSize[0]}
      height={c.imageSize[1]}
      alt=""
      draggable="false"
    />
  ),
}));

// Thumbnail height per breakpoint; `lift` must clear it so photos rise fully above the folder.
const THUMB_H = { wide: 132, narrow: 82 };

function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export default function Certifications() {
  const [preview, setPreview] = useState(null);
  const closePreview = useCallback(() => setPreview(null), []);
  const narrow = useMedia('(max-width: 560px)');
  const touch = useMedia('(hover: none), (pointer: coarse)');
  const [folderRef, inView] = useInView({ threshold: 0.5 });

  // Open the folder once when the section scrolls into view, so the certificates fly out.
  useEffect(() => {
    if (!inView) return;
    const trigger = folderRef.current?.querySelector('.folder-float__trigger');
    if (trigger?.getAttribute('aria-expanded') === 'false') trigger.click();
  }, [inView, folderRef]);

  const onSelect = (id) => setPreview(CERTIFICATIONS.find((c) => c.id === id) ?? null);

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

        <div ref={folderRef} className="credfolder">
          <FolderFloat
            items={PILLS}
            label="Verified credentials"
            sublabel={`${CERTIFICATIONS.length} hackathon certificates`}
            trigger={touch ? 'click' : 'hover'}
            closeOnSelect={false}
            physics
            drift={0.5}
            onSelect={onSelect}
            {...FOLDER_COLORS}
            width={narrow ? 220 : 260}
            height={narrow ? 156 : 180}
            radius={16}
            spread={narrow ? 168 : 320}
            lift={(narrow ? THUMB_H.narrow : THUMB_H.wide) + 36}
            tilt={8}
            flapAngle={34}
            restAngle={16}
            openDuration={560}
            stagger={70}
            bounce={0.3}
          />
        </div>
        <p className="credfolder__hint mono">
          <span className="credfolder__hint-mouse">hover the folder · click a certificate to view it full size · drag them around</span>
          <span className="credfolder__hint-touch">tap the folder · tap a certificate to view it</span>
        </p>
      </div>
      <Lightbox cert={preview} onClose={closePreview} />
    </section>
  );
}
