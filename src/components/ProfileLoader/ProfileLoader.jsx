import { useEffect, useRef, useState } from 'react';
import './ProfileLoader.css';

const EXIT_MS = 800;
const SKIP_MS = 400;
const LABEL = 'LOADING PROFILE...';

export default function ProfileLoader({ duration = 4500, onFadeStart, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const barRef = useRef(null);
  const callbacks = useRef({ onFadeStart, onComplete });
  useEffect(() => {
    callbacks.current = { onFadeStart, onComplete };
  });

  const skipRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    let exitTimer = 0;
    let lastShown = -1;
    let done = false;
    const start = performance.now();

    const finish = () => {
      if (done) return;
      done = true;
      setExiting(true);
      callbacks.current.onFadeStart?.();
      exitTimer = window.setTimeout(() => callbacks.current.onComplete?.(), EXIT_MS);
    };

    // Skipping sprints the remaining progress over SKIP_MS instead of jumping.
    let skip = null;
    skipRef.current = () => {
      if (skip || done) return;
      const now = performance.now();
      skip = { at: now, from: Math.min((now - start) / duration, 1) };
    };

    const tick = (now) => {
      const t = skip
        ? Math.min(skip.from + ((now - skip.at) / SKIP_MS) * (1 - skip.from), 1)
        : Math.min((now - start) / duration, 1);
      // ease-in-out so the bar never "jumps" at either end
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const pct = eased * 100;
      if (barRef.current) barRef.current.style.transform = `scaleX(${eased})`;
      const rounded = Math.round(pct);
      if (rounded !== lastShown) {
        lastShown = rounded;
        setProgress(rounded);
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) skipRef.current?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      window.removeEventListener('keydown', onKey);
    };
  }, [duration]);

  return (
    <div
      className={`profile-loader ${exiting ? 'profile-loader--exit' : ''}`}
      role="progressbar"
      aria-label="Loading profile"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="profile-loader__scan" />

      <div className="profile-loader__core">
        <svg className="profile-loader__rings" viewBox="0 0 240 240" aria-hidden="true">
          <defs>
            <linearGradient id="pl-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00E5CC" />
              <stop offset="1" stopColor="#6F00FF" />
            </linearGradient>
          </defs>
          <g className="ring ring--outer">
            <circle cx="120" cy="120" r="112" fill="none" stroke="url(#pl-grad)" strokeWidth="1.5" strokeDasharray="60 16 8 16" />
          </g>
          <g className="ring ring--mid">
            <circle cx="120" cy="120" r="94" fill="none" stroke="#6F00FF" strokeOpacity=".75" strokeWidth="2.5" strokeDasharray="140 50" strokeLinecap="round" />
          </g>
          <g className="ring ring--inner">
            <circle cx="120" cy="120" r="76" fill="none" stroke="#00E5CC" strokeOpacity=".6" strokeWidth="1" strokeDasharray="3 7" />
          </g>
          <g className="ring ring--bead">
            <circle cx="120" cy="8" r="4.5" fill="#00E5CC" className="bead" />
            <circle cx="120" cy="8" r="10" fill="#00E5CC" opacity=".18" />
          </g>
        </svg>

        <div className="profile-loader__badge">
          <span>KSCS</span>
          <span className="dot">.</span>
        </div>
      </div>

      <p className="profile-loader__label" aria-hidden="true">
        {LABEL.split('').map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 70}ms` }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </p>

      <div className="profile-loader__bar">
        <div className="profile-loader__fill" ref={barRef} />
      </div>
      <div className="profile-loader__meta">
        <span>SYS.BOOT // KSCS_PROFILE</span>
        <span className="pct">{String(progress).padStart(3, '0')}%</span>
      </div>
      <button type="button" className="profile-loader__skip mono" onClick={() => skipRef.current?.()}>
        Skip intro <kbd>Esc</kbd>
      </button>
    </div>
  );
}
