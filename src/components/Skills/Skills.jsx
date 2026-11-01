import { useEffect, useMemo, useState } from 'react';
import { FolderGit2, GitPullRequest, Layers, Trophy } from 'lucide-react';
import useInView from '../../hooks/useInView';
import Reveal from '../common/Reveal';
import ScrambleText from '../common/ScrambleText';
import { MATRIX_SKILLS, METRICS } from '../../data/skillsData';
import './Skills.css';

const METRIC_ICONS = {
  repos: FolderGit2,
  contributions: GitPullRequest,
  hackathons: Trophy,
  frameworks: Layers,
};

/* Connect each node to its nearest neighbours to form the "DNA" mesh. */
function buildLinks(nodes, perNode = 2) {
  const seen = new Set();
  const links = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, perNode)
      .forEach(({ j }) => {
        const k = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(k)) {
          seen.add(k);
          links.push([i, j]);
        }
      });
  });
  return links;
}

function TechMatrix() {
  const [active, setActive] = useState(null);
  const [pinned, setPinned] = useState(false);
  const links = useMemo(() => buildLinks(MATRIX_SKILLS), []);

  // Tap outside to dismiss a pinned tooltip.
  useEffect(() => {
    if (!pinned) return undefined;
    const onDown = (e) => {
      if (!e.target.closest?.('.matrix__bubble')) {
        setPinned(false);
        setActive(null);
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [pinned]);

  const skill = active !== null ? MATRIX_SKILLS[active] : null;

  return (
    <div className="matrix glass spotlight">
      <div className="matrix__head mono">
        <span>
          <i className="matrix__led" /> TECH_MATRIX.live
        </span>
        <span>{MATRIX_SKILLS.length} nodes</span>
      </div>

      <div className="matrix__canvas">
        <svg className="matrix__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map(([a, b]) => {
            const lit = active === a || active === b;
            return (
              <line
                key={`${a}-${b}`}
                x1={MATRIX_SKILLS[a].x}
                y1={MATRIX_SKILLS[a].y}
                x2={MATRIX_SKILLS[b].x}
                y2={MATRIX_SKILLS[b].y}
                className={lit ? 'is-lit' : ''}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {MATRIX_SKILLS.map((s, i) => {
          const { Icon } = s;
          return (
            <button
              type="button"
              key={s.name}
              className={`matrix__bubble ${active === i ? 'is-active' : ''} ${
                active !== null && active !== i ? 'is-dim' : ''
              }`}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                '--size': `${s.size}px`,
                '--glow': s.color,
                '--dur': `${s.dur}s`,
                '--delay': `${-i * 0.7}s`,
              }}
              onMouseEnter={() => !pinned && setActive(i)}
              onMouseLeave={() => !pinned && setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => !pinned && setActive(null)}
              onClick={() => {
                if (pinned && active === i) {
                  setPinned(false);
                  setActive(null);
                } else {
                  setPinned(true);
                  setActive(i);
                }
              }}
              aria-label={`${s.name}: ${s.level}% proficiency`}
            >
              <span className="matrix__float">
                <span className="matrix__pulse" />
                <Icon size={Math.round(s.size * 0.46)} />
              </span>
            </button>
          );
        })}

        {skill && (
          <div
            className={`hud ${skill.y < 40 ? 'hud--below' : 'hud--above'}`}
            style={{
              left: `clamp(12%, ${skill.x}%, 82%)`,
              top: `${skill.y}%`,
              '--glow': skill.color,
              '--offset': `${skill.size / 2 + 14}px`,
            }}
            role="status"
          >
            <div className="hud__row">
              <strong>{skill.name}</strong>
              <span className="hud__pct mono">{skill.level}%</span>
            </div>
            <span className="hud__cat mono">{skill.category}</span>
            <div className="hud__bar">
              <i key={skill.name} style={{ '--w': `${skill.level}%` }} />
            </div>
          </div>
        )}
      </div>
      <p className="matrix__hint mono">hover or tap a node to inspect</p>
    </div>
  );
}

function MetricCard({ metric, start, index }) {
  const [val, setVal] = useState(0);
  const Icon = METRIC_ICONS[metric.key];

  useEffect(() => {
    if (!start) return undefined;
    let raf = 0;
    const duration = 1000;
    const delay = index * 120;
    const t0 = performance.now() + delay;
    const tick = (now) => {
      const progress = Math.min(Math.max((now - t0) / duration, 0), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(metric.value * easeOut));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, metric.value, index]);

  return (
    <div className={`metric glass spotlight is-interactive ${start ? 'is-live' : ''}`} data-tilt="10">
      <div className="metric__top">
        <span className="metric__icon">
          <Icon size={20} />
        </span>
        <span className="metric__bars" aria-hidden="true">
          {metric.bars.map((h, i) => (
            <i key={i} style={{ '--h': h / 10, '--i': i }} />
          ))}
        </span>
      </div>
      <strong className="metric__value">
        {val}
        <span>{metric.suffix}</span>
      </strong>
      <span className="metric__label mono">{metric.label}</span>
      <span className="metric__detail">{metric.detail}</span>
      <span className="metric__spark" aria-hidden="true" />
    </div>
  );
}

export default function Skills() {
  const [metricsRef, metricsInView] = useInView({ threshold: 0.2 });

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <Reveal className="section-head">
          <p className="section-tag">
            <ScrambleText text="Skills DNA" />
          </p>
          <h2 className="section-title">
            The stack I <span className="text-gradient">build with</span>.
          </h2>
          <p className="section-sub">
            A living map of the tools in my kit — from interface to infrastructure.
          </p>
        </Reveal>

        <div className="skills__grid">
          <Reveal className="skills__matrix-col">
            <TechMatrix />
          </Reveal>
          <div className="skills__metrics" ref={metricsRef}>
            {METRICS.map((m, i) => (
              <Reveal key={m.key} delay={i * 90}>
                <MetricCard metric={m} start={metricsInView} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
