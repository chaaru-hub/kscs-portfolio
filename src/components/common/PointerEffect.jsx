import { useEffect, useRef, useState } from 'react';
import './PointerEffect.css';

const LERP = 0.16;
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, .is-interactive, [data-cursor="hover"]';

export default function PointerEffect() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add('has-custom-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let raf = 0;
    let visible = false;
    let hovering = false;

    const setVisible = (v) => {
      if (visible === v) return;
      visible = v;
      dotRef.current?.classList.toggle('is-visible', v);
      ringRef.current?.classList.toggle('is-visible', v);
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      setVisible(true);
      const isHover = !!(e.target instanceof Element && e.target.closest(INTERACTIVE));
      if (isHover !== hovering) {
        hovering = isHover;
        ringRef.current?.classList.toggle('is-hover', isHover);
        dotRef.current?.classList.toggle('is-hover', isHover);
      }
    };

    const onDown = (e) => {
      ringRef.current?.classList.add('is-down');
      const id = performance.now() + Math.random();
      setRipples((r) => [...r.slice(-5), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    };
    const onUp = () => ringRef.current?.classList.remove('is-down');
    const onLeave = () => setVisible(false);

    const loop = () => {
      ring.x += (target.x - ring.x) * LERP;
      ring.y += (target.y - ring.y) * LERP;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-fx" aria-hidden="true">
      <div className="pointer-fx__ring" ref={ringRef}>
        <span />
      </div>
      <div className="pointer-fx__dot" ref={dotRef}>
        <span />
      </div>
      {ripples.map((r) => (
        <div key={r.id} className="pointer-fx__ripple" style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}
