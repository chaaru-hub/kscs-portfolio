/* Illustrative, animated mock interfaces for each project (not screenshots).
   Shown on the back of the flip card; remount (key) to replay the animation. */

function Chrome({ url, children }) {
  return (
    <div className="pv">
      <div className="pv__bar">
        <span className="pv__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="pv__url mono">{url}</span>
        <span className="pv__live mono">
          <i /> live
        </span>
      </div>
      <div className="pv__screen">{children}</div>
    </div>
  );
}

const INCIDENTS = [
  { x: 390, y: 70, sev: 'critical' },
  { x: 470, y: 125, sev: 'high' },
  { x: 320, y: 140, sev: 'critical' },
  { x: 530, y: 55, sev: 'medium' },
  { x: 255, y: 80, sev: 'medium' },
];
const BASE = { x: 175, y: 150 };

function ResQVisual() {
  return (
    <Chrome url="resq.app/command-center">
      <svg viewBox="0 0 600 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="pv-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="rgba(255,255,255,0.05)" />
          </pattern>
          <radialGradient id="pv-zone">
            <stop offset="0" stopColor="#ff3d6e" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ff3d6e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="180" fill="#0a0e12" />
        <rect width="600" height="180" fill="url(#pv-grid)" />
        <path
          d="M600 0 V180 H565 C545 150 578 130 552 108 C528 86 562 64 536 44 C512 26 545 12 528 0 Z"
          fill="rgba(56,130,255,0.12)"
          stroke="rgba(56,130,255,0.35)"
        />
        <path d="M0 110 C120 100 170 40 300 50 S470 100 560 86" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle cx="360" cy="100" r="90" fill="url(#pv-zone)" className="pv-zone" />

        {INCIDENTS.map((p, i) => (
          <path
            key={`r${i}`}
            className="pv-route"
            d={`M${BASE.x} ${BASE.y} Q ${(BASE.x + p.x) / 2} ${Math.min(BASE.y, p.y) - 30} ${p.x} ${p.y}`}
            style={{ animationDelay: `${i * -0.6}s` }}
          />
        ))}

        <g transform={`translate(${BASE.x} ${BASE.y})`}>
          <rect x="-10" y="-10" width="20" height="20" rx="5" fill="#00e5cc" />
          <path d="M-5 0h10M0 -5v10" stroke="#06231f" strokeWidth="2.4" strokeLinecap="round" />
        </g>

        {INCIDENTS.map((p, i) => (
          <g key={`i${i}`} transform={`translate(${p.x} ${p.y})`} className={`pv-inc pv-inc--${p.sev}`}>
            <circle r="15" className="pv-inc__pulse" style={{ animationDelay: `${i * 0.35}s` }} />
            <circle r="6" className="pv-inc__dot" />
          </g>
        ))}
      </svg>

      <div className="pv-panel">
        <p className="mono">INCIDENTS</p>
        <ul>
          <li>
            <i className="sev sev--critical" /> Critical <b>2</b>
          </li>
          <li>
            <i className="sev sev--high" /> High <b>1</b>
          </li>
          <li>
            <i className="sev sev--medium" /> Medium <b>2</b>
          </li>
        </ul>
      </div>
    </Chrome>
  );
}

const USAGE = [32, 38, 35, 30, 34, 41, 47, 44, 39, 36, 72, 43, 40, 37, 35, 33];

function EcoMindVisual() {
  const w = 560;
  const h = 95;
  const max = 80;
  const step = w / (USAGE.length - 1);
  const floor = 150;
  const pts = USAGE.map((v, i) => [20 + i * step, floor - (v / max) * h]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]} ${floor + 10} L20 ${floor + 10} Z`;
  const spike = pts[10];

  return (
    <Chrome url="ecomind.ai/dashboard">
      <svg viewBox="0 0 600 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="pv-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00e5a0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#00e5a0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="600" height="180" fill="#0a0e12" />
        {[50, 80, 110, 140].map((y) => (
          <line key={y} x1="20" x2="580" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
        ))}
        {USAGE.map((v, i) => (
          <rect
            key={i}
            className="pv-bar"
            x={14 + i * step}
            y={floor + 10 - (v / max) * 40}
            width="12"
            height={(v / max) * 40}
            rx="3"
            fill={i === 10 ? 'rgba(255,90,110,0.5)' : 'rgba(10,92,255,0.35)'}
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
        <path d={area} fill="url(#pv-area)" className="pv-area" />
        <path d={line} fill="none" stroke="#00e5a0" strokeWidth="2.5" className="pv-line" pathLength="1" />
        <line x1={spike[0]} x2={spike[0]} y1={spike[1]} y2={floor + 10} stroke="#ff5a6e" strokeDasharray="3 4" />
        <g transform={`translate(${spike[0]} ${spike[1]})`}>
          <circle r="13" className="pv-anomaly__pulse" />
          <circle r="5" fill="#ff5a6e" />
        </g>
      </svg>

      <div className="pv-kpis">
        <div>
          <span className="mono">LIVE LOAD</span>
          <b>2.4 kW</b>
        </div>
        <div>
          <span className="mono">SAVED</span>
          <b className="good">−18%</b>
        </div>
      </div>
      <div className="pv-alert">
        <b>Anomaly detected</b>
        <span className="mono">AC unit · +38% vs baseline</span>
      </div>
    </Chrome>
  );
}

const TICKETS = [
  { text: 'Garbage bin overflowing for 3 days', dept: 'Sanitation', urgency: 'critical' },
  { text: 'Streetlight not working near bus stop', dept: 'Electrical', urgency: 'high' },
  { text: 'Water pipe leaking on main road', dept: 'Water Supply', urgency: 'high' },
  { text: 'Large pothole causing traffic', dept: 'Roads', urgency: 'medium' },
];

function CivicVisual() {
  return (
    <Chrome url="civic-ai.gov/triage">
      <div className="pv-triage">
        <div className="pv-triage__head mono">
          <span>INCOMING GRIEVANCES</span>
          <span className="pv-triage__nlp">NLP auto-routing</span>
        </div>
        <ul>
          {TICKETS.map((t, i) => (
            <li key={t.text} style={{ '--i': i }}>
              <i className={`sev sev--${t.urgency}`} />
              <span className="pv-triage__text">{t.text}</span>
              <span className="pv-triage__dept mono">{t.dept}</span>
            </li>
          ))}
        </ul>
      </div>
    </Chrome>
  );
}

const VISUALS = { resq: ResQVisual, ecomind: EcoMindVisual, 'civic-ai': CivicVisual };

export default function ProjectVisual({ id }) {
  const Visual = VISUALS[id];
  return Visual ? <Visual /> : null;
}
