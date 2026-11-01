import { useEffect, useRef, useState } from 'react';
import { Move3d } from 'lucide-react';
import {
  AwsIcon,
  CppIcon,
  CssIcon,
  DockerIcon,
  FastApiIcon,
  GitIcon,
  HtmlIcon,
  JavaScriptIcon,
  MongoIcon,
  NextIcon,
  NodeIcon,
  PostgresIcon,
  PythonIcon,
  ReactIcon,
  SqlIcon,
  TypeScriptIcon,
  ViteIcon,
} from '../common/BrandIcons';
import './TechGlobe.css';

const TECH = [
  { name: 'React', Icon: ReactIcon, tag: 'Frontend' },
  { name: 'Python', Icon: PythonIcon, tag: 'AI · Backend' },
  { name: 'JavaScript', Icon: JavaScriptIcon, tag: 'Core language' },
  { name: 'TypeScript', Icon: TypeScriptIcon, tag: 'Typed JS' },
  { name: 'FastAPI', Icon: FastApiIcon, tag: 'APIs' },
  { name: 'Node.js', Icon: NodeIcon, tag: 'Runtime' },
  { name: 'HTML5', Icon: HtmlIcon, tag: 'Markup' },
  { name: 'CSS3', Icon: CssIcon, tag: 'Styling' },
  { name: 'Vite', Icon: ViteIcon, tag: 'Tooling' },
  { name: 'C++', Icon: CppIcon, tag: 'Embedded' },
  { name: 'SQL', Icon: SqlIcon, tag: 'Databases' },
  { name: 'PostgreSQL', Icon: PostgresIcon, tag: 'Databases' },
  { name: 'MongoDB', Icon: MongoIcon, tag: 'NoSQL' },
  { name: 'Next.js', Icon: NextIcon, tag: 'Framework' },
  { name: 'Git', Icon: GitIcon, tag: 'Version control' },
  { name: 'Docker', Icon: DockerIcon, tag: 'DevOps' },
  { name: 'AWS', Icon: AwsIcon, tag: 'Cloud' },
];

const DOT_COUNT = 380;
const AUTO_SPIN = 0.0032; // rad / frame
const PERSPECTIVE = 3.2; // in sphere radii

/** Evenly spread points on a unit sphere (golden-angle spiral). */
function fibonacciSphere(n) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i += 1) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return pts;
}

/** Spherical interpolation between two unit vectors. */
function slerp(a, b, t) {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-4) return a;
  const s = Math.sin(omega);
  const k1 = Math.sin((1 - t) * omega) / s;
  const k2 = Math.sin(t * omega) / s;
  // lift the arc slightly off the surface so pulses read as "flights"
  const lift = 1 + Math.sin(Math.PI * t) * 0.12;
  return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift];
}

function readAccent() {
  const css = getComputedStyle(document.documentElement);
  return {
    a: css.getPropertyValue('--cyan-rgb').trim() || '0, 229, 204',
    b: css.getPropertyValue('--violet-rgb').trim() || '111, 0, 255',
  };
}

export default function TechGlobe() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const nodeRefs = useRef([]);
  const hoverRef = useRef(-1);
  const kickRef = useRef(null);
  const [hovered, setHovered] = useState(-1);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced =
      document.documentElement.dataset.motion === 'reduced' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dots = fibonacciSphere(DOT_COUNT);
    const anchors = fibonacciSphere(TECH.length);
    let colors = readAccent();

    const state = {
      yaw: 0.6,
      pitch: -0.28,
      vel: AUTO_SPIN,
      pitchTarget: -0.28,
      spinTarget: AUTO_SPIN,
      size: 0,
      dpr: 1,
      drag: null,
      visible: true,
      start: performance.now(),
      dt: 1,
    };

    // Data pulses travelling between two tech nodes along great circles.
    const pulses = Array.from({ length: 3 }, (_, i) => ({ from: i, to: (i + 5) % TECH.length, t: i / 3 }));
    const respawn = (p) => {
      p.from = p.to;
      do {
        p.to = Math.floor(Math.random() * TECH.length);
      } while (p.to === p.from);
      p.t = 0;
    };

    const resize = () => {
      const size = wrap.clientWidth;
      state.size = size;
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * state.dpr;
      canvas.height = size * state.dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    };

    // rotate (yaw around Y, then pitch around X) and project
    const project = (p, cosY, sinY, cosX, sinX, R, c) => {
      const x1 = p[0] * cosY + p[2] * sinY;
      const z1 = -p[0] * sinY + p[2] * cosY;
      const y2 = p[1] * cosX - z1 * sinX;
      const z2 = p[1] * sinX + z1 * cosX;
      const f = PERSPECTIVE / (PERSPECTIVE - z2);
      return { x: c + x1 * R * f, y: c + y2 * R * f, z: z2, f };
    };

    const draw = (now) => {
      const { size } = state;
      const c = size / 2;
      const R = size * 0.36;
      const cosY = Math.cos(state.yaw);
      const sinY = Math.sin(state.yaw);
      const cosX = Math.cos(state.pitch);
      const sinX = Math.sin(state.pitch);
      const P = (p) => project(p, cosY, sinY, cosX, sinX, R, c);

      // entrance: radius grows from the core, nodes stagger out
      // rAF timestamps can predate state.start on the first frame, so clamp at 0
      const age = reduced ? 1e9 : Math.max(0, now - state.start);
      const grow = Math.min(age / 1100, 1);
      const growEase = 1 - Math.pow(1 - grow, 3);

      ctx.clearRect(0, 0, size, size);

      // atmosphere glow
      const glow = ctx.createRadialGradient(c, c, R * 0.2, c, c, R * 1.45);
      glow.addColorStop(0, `rgba(${colors.b}, 0.22)`);
      glow.addColorStop(0.6, `rgba(${colors.a}, 0.06)`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c, c, R * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // rim
      ctx.strokeStyle = `rgba(${colors.a}, ${0.22 * growEase})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(c, c, R * growEase * (PERSPECTIVE / (PERSPECTIVE - 0)), 0, Math.PI * 2);
      ctx.stroke();

      // wireframe: parallels + meridians, faded by depth.
      // Segments are grouped into a few alpha buckets so each bucket is one stroke() call.
      const seg = 56;
      const BUCKETS = 6;
      const wire = Array.from({ length: BUCKETS }, () => new Path2D());
      const line = (pointAt) => {
        let prev = P(pointAt(0));
        for (let i = 1; i <= seg; i += 1) {
          const cur = P(pointAt(i / seg));
          const depth = ((prev.z + cur.z) / 2 + 1) / 2;
          const path = wire[Math.min(BUCKETS - 1, Math.floor(depth * BUCKETS))];
          path.moveTo(c + (prev.x - c) * growEase, c + (prev.y - c) * growEase);
          path.lineTo(c + (cur.x - c) * growEase, c + (cur.y - c) * growEase);
          prev = cur;
        }
      };
      for (const lat of [-0.6, -0.3, 0, 0.3, 0.6]) {
        const r = Math.cos(lat * Math.PI * 0.5 * 1.2);
        const y = Math.sin(lat * Math.PI * 0.5 * 1.2);
        line((t) => [Math.cos(t * Math.PI * 2) * r, y, Math.sin(t * Math.PI * 2) * r]);
      }
      for (let m = 0; m < 6; m += 1) {
        const a = (m / 6) * Math.PI;
        line((t) => {
          const th = t * Math.PI * 2;
          return [Math.cos(a) * Math.cos(th), Math.sin(th), Math.sin(a) * Math.cos(th)];
        });
      }
      ctx.lineWidth = 0.8;
      wire.forEach((path, k) => {
        ctx.strokeStyle = `rgba(${colors.a}, ${(0.05 + 0.2 * ((k + 0.5) / BUCKETS)) * growEase})`;
        ctx.stroke(path);
      });

      // dots, batched by depth bucket (one fill() per bucket)
      const dotPaths = Array.from({ length: BUCKETS }, () => new Path2D());
      for (const d of dots) {
        const p = P(d);
        const depth = (p.z + 1) / 2;
        const x = c + (p.x - c) * growEase;
        const y = c + (p.y - c) * growEase;
        const r = (0.6 + depth * 1.2) * p.f;
        const path = dotPaths[Math.min(BUCKETS - 1, Math.floor(depth * BUCKETS))];
        path.moveTo(x + r, y);
        path.arc(x, y, r, 0, Math.PI * 2);
      }
      dotPaths.forEach((path, k) => {
        const depth = (k + 0.5) / BUCKETS;
        ctx.fillStyle = `rgba(${depth > 0.5 ? colors.a : colors.b}, ${(0.12 + 0.7 * depth) * growEase})`;
        ctx.fill(path);
      });

      // pulses
      if (grow >= 1) {
        for (const pulse of pulses) {
          if (!reduced) pulse.t += 0.006 * state.dt;
          if (pulse.t >= 1) respawn(pulse);
          const a = anchors[pulse.from];
          const b = anchors[pulse.to];
          // faint trail of the whole arc
          ctx.lineWidth = 1;
          let prev = P(slerp(a, b, 0));
          for (let i = 1; i <= 30; i += 1) {
            const t = i / 30;
            if (t > pulse.t) break;
            const cur = P(slerp(a, b, t));
            const fade = Math.max(0, 1 - (pulse.t - t) * 3);
            ctx.strokeStyle = `rgba(${colors.a}, ${0.55 * fade * ((cur.z + 1) / 2 + 0.2)})`;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(cur.x, cur.y);
            ctx.stroke();
            prev = cur;
          }
          // head: soft halo + bright core (cheaper than shadowBlur)
          const head = P(slerp(a, b, pulse.t));
          const vis = 0.4 + 0.6 * ((head.z + 1) / 2);
          ctx.fillStyle = `rgba(${colors.a}, ${0.18 * vis})`;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 7 * head.f, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${colors.a}, ${vis})`;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 2.6 * head.f, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // tech nodes (DOM), staggered entrance
      anchors.forEach((anchor, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        const p = P(anchor);
        const local = Math.min(Math.max((age - 250 - i * 55) / 700, 0), 1);
        const e = 1 - Math.pow(1 - local, 3);
        const x = c + (p.x - c) * 1.18 * e;
        const y = c + (p.y - c) * 1.18 * e;
        const depth = (p.z + 1) / 2;
        const isHover = hoverRef.current === i;
        const scale = (0.55 + depth * 0.6) * (isHover ? 1.35 : 1) * (0.4 + 0.6 * e);
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = String(((0.18 + depth * 0.82) * e).toFixed(3));
        // only touch z-index / pointer-events when they actually change (avoids restyles)
        const z = String(Math.round(depth * 20) + (isHover ? 100 : 0));
        if (el.style.zIndex !== z) el.style.zIndex = z;
        const pe = depth > 0.42 ? 'auto' : 'none';
        if (el.style.pointerEvents !== pe) el.style.pointerEvents = pe;
      });
    };

    let raf = 0;
    let last = 0;
    // Time-based: dt = 1 at 60fps, so the spin speed is the same on 60/120/144 Hz screens
    // and a late frame catches up instead of visibly slowing the globe.
    const loop = (now) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / (1000 / 60), 3) : 1;
      last = now;
      state.dt = dt;
      if (!state.drag) {
        const target = hoverRef.current >= 0 ? 0 : state.spinTarget;
        state.vel += (target - state.vel) * (1 - Math.pow(1 - 0.035, dt));
        if (!reduced) state.yaw += state.vel * dt;
        state.pitch += (state.pitchTarget - state.pitch) * (1 - Math.pow(1 - 0.045, dt));
      }
      draw(now);
      if (state.visible && !reduced) raf = requestAnimationFrame(loop);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // pointer: hover steers the spin, drag rotates with inertia
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (state.drag) {
        const dx = e.clientX - state.drag.x;
        const dy = e.clientY - state.drag.y;
        state.drag.x = e.clientX;
        state.drag.y = e.clientY;
        state.yaw += dx * 0.008;
        state.pitch = Math.max(-1.1, Math.min(1.1, state.pitch - dy * 0.006));
        state.pitchTarget = state.pitch;
        state.vel = dx * 0.008;
        kick();
        return;
      }
      if (e.pointerType === 'mouse') {
        state.spinTarget = AUTO_SPIN + px * 0.012;
        state.pitchTarget = -0.28 + py * 0.5;
      }
    };
    const onDown = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (e.target.closest('.tg-node')) return;
      state.drag = { x: e.clientX, y: e.clientY };
      setDragging(true);
      wrap.setPointerCapture?.(e.pointerId);
    };
    const onUp = () => {
      if (!state.drag) return;
      state.drag = null;
      setDragging(false);
      kick();
    };
    const onLeave = () => {
      state.spinTarget = AUTO_SPIN;
      state.pitchTarget = -0.28;
    };

    const io = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) kick();
    });
    io.observe(wrap);

    const mo = new MutationObserver(() => {
      colors = readAccent();
      kick();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-accent'] });

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(wrap);

    resize();
    kick();
    // reduced motion: draw the finished state once
    if (reduced) requestAnimationFrame((t) => draw(t));

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);
    wrap.addEventListener('pointerleave', onLeave);
    kickRef.current = kick;

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const setHover = (i) => {
    hoverRef.current = i;
    setHovered(i);
    kickRef.current?.();
  };

  const active = hovered >= 0 ? TECH[hovered] : null;

  return (
    <div className="tech-globe">
      <div ref={wrapRef} className={`tg ${dragging ? 'is-dragging' : ''}`}>
        <canvas ref={canvasRef} className="tg__canvas" aria-hidden="true" />
        <span className="tg__core" aria-hidden="true" />
        <ul className="tg__nodes" aria-label="Technologies I work with">
          {TECH.map(({ name, Icon }, i) => (
            <li key={name}>
              <button
                type="button"
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className={`tg-node ${hovered === i ? 'is-hover' : ''}`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(-1)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(-1)}
                onClick={() => setHover(hovered === i ? -1 : i)}
                aria-label={name}
              >
                <Icon size={26} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={`tg__readout mono ${active ? 'is-active' : ''}`} aria-live="polite">
        {active ? (
          <>
            <span className="tg__readout-name">{active.name}</span>
            <span className="tg__readout-tag">{active.tag}</span>
          </>
        ) : (
          <span className="tg__readout-hint">
            <Move3d size={14} /> Drag to spin · hover a logo
          </span>
        )}
      </div>
    </div>
  );
}
