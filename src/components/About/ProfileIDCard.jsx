import { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import useInView from '../../hooks/useInView';
import ProfilePhoto from '../common/ProfilePhoto';
import './ProfileIDCard.css';

const FOCUS = ['Full-Stack Web Apps', 'Frontend Architecture', 'Embedded & IoT'];
const METRICS = [
  { value: '3+', label: 'Projects' },
  { value: '6+', label: 'Techs' },
  { value: '∞', label: 'Curiosity' },
];

const INFO = [
  ['DEPT', 'CSE'],
  ['CAMPUS', 'Ramapuram'],
  ['PROGRAM', 'B.Tech'],
  ['VALID', '2025–29'],
];

// Deterministic dot-matrix "access chip" pattern (decorative, not a QR code).
function makeMatrix(seed = 'KSCS-SRM-CSE', size = 13) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const cells = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      h = (h * 1103515245 + 12345) >>> 0;
      const border = x === 0 || y === 0 || x === size - 1 || y === size - 1;
      if (border ? (x + y) % 2 === 0 : (h >>> 16) % 100 < 46) cells.push([x, y]);
    }
  }
  return cells;
}

export default function ProfileIDCard() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const [dropKey, setDropKey] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const matrix = useMemo(() => makeMatrix(), []);

  return (
    <div className="id-rig" ref={ref}>
      <div className="id-mount" aria-hidden="true">
        <span className="id-mount__screw" />
      </div>

      <div key={dropKey} className={`id-drop ${inView ? 'is-dropped' : ''}`}>
        <div className="id-pendulum">
          <span className="id-string" aria-hidden="true" />
          <div className="id-payload">
          <button
            type="button"
            className="id-bob"
            onClick={() => {
              setFlipped(false);
              setDropKey((k) => k + 1);
            }}
            aria-label="Replay ID card entrance"
            title="Replay entrance"
          />
          <span className="id-hook" aria-hidden="true" />

          <div
            className={`id-card ${flipped ? 'is-flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped((f) => !f);
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            aria-label="Student ID card — press to flip"
          >
            <div className="id-card__inner">
              {/* ---------- FRONT: developer pass ---------- */}
              <div className="id-face id-face--front">
                <span className="id-holo" aria-hidden="true" />

                <header className="idv-band">
                  <span className="id-slot" aria-hidden="true" />
                  <div className="idv-band__row">
                    <span className="idv-logo">
                      KSCS<span>.</span>
                    </span>
                    <span className="idv-chip" aria-hidden="true" />
                  </div>
                  <span className="idv-band__kicker mono">DEV PASS · 25–29</span>
                </header>

                <div className="idv-hero">
                  <div className="idv-photo">
                    <ProfilePhoto />
                    <span className="idv-seal mono" aria-hidden="true">
                      SRM
                      <br />✓
                    </span>
                  </div>
                  <div className="idv-status">
                    <span className="idv-pill mono">
                      <i /> ACTIVE
                    </span>
                    <span className="idv-idno mono">
                      ID NO.
                      <b>KSCS-0x7E3</b>
                    </span>
                  </div>
                </div>

                <div className="idv-name">
                  <span className="mono">KARANAM SELVAKUMAR</span>
                  <strong>Chaaruseelan</strong>
                </div>

                <div className="idv-roles">
                  <span>Full-Stack Developer</span>
                  <span>AI</span>
                </div>

                <dl className="idv-info">
                  {INFO.map(([k, v]) => (
                    <div key={k}>
                      <dt className="mono">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>

                <footer className="idv-foot">
                  <svg className="idv-matrix" viewBox="0 0 13 13" aria-hidden="true">
                    {matrix.map(([x, y]) => (
                      <rect key={`${x}-${y}`} x={x} y={y} width="0.82" height="0.82" rx="0.18" />
                    ))}
                  </svg>
                  <div className="idv-foot__text mono">
                    <strong>SRM IST · RAMAPURAM</strong>
                    <span>Chennai, Tamil Nadu</span>
                    <span className="idv-access">
                      ACCESS
                      {[0, 1, 2, 3, 4].map((i) => (
                        <i key={i} className={i < 4 ? 'on' : ''} />
                      ))}
                    </span>
                  </div>
                </footer>

                <span className="idv-strip mono" aria-hidden="true">
                  ACCESS · ALL AREAS
                </span>
              </div>

              {/* ---------- BACK: system profile ---------- */}
              <div className="id-face id-face--back">
                <span className="idv-stripe" aria-hidden="true" />

                <div className="idv-back">
                  <div className="idv-back__head mono">
                    <span>{'// system.profile'}</span>
                    <span className="idv-ok">
                      <ShieldCheck size={13} /> SEC_OK
                    </span>
                  </div>

                  <div className="idv-term mono">
                    <p>
                      <span className="idv-prompt">$</span> whoami
                    </p>
                    <p className="idv-out">kscs · cse undergrad</p>
                    <p>
                      <span className="idv-prompt">$</span> cat focus.txt
                    </p>
                    {FOCUS.map((f) => (
                      <p key={f} className="idv-out">
                        <span className="idv-arrow">›</span> {f}
                      </p>
                    ))}
                    <p>
                      <span className="idv-prompt">$</span> status
                    </p>
                    <p className="idv-out idv-out--live">
                      <i /> open to internships<span className="idv-caret" />
                    </p>
                  </div>

                  <div className="idv-stats">
                    {METRICS.map((m) => (
                      <div key={m.label}>
                        <strong>{m.value}</strong>
                        <span className="mono">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="idv-sign">
                    <span className="idv-sign__name">Chaaruseelan</span>
                    <span className="idv-sign__label mono">AUTHORISED SIGNATURE</span>
                  </div>

                  <p className="idv-return mono">If found, return to chaaruseelan8@gmail.com</p>
                </div>
              </div>
            </div>
            <span className="id-scan" aria-hidden="true" />
          </div>
          </div>
        </div>
      </div>
      <p className="id-hint mono">hover / tap to flip · click the bob to replay</p>
    </div>
  );
}
