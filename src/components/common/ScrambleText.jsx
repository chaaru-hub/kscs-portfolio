import { useEffect, useState } from 'react';
import useInView from '../../hooks/useInView';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01ABCDEFX';

/** Decodes its text from random glyphs when scrolled into view. */
export default function ScrambleText({ text, duration = 900, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return undefined;
    if (document.documentElement.dataset.motion === 'reduced') return undefined;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const revealed = Math.floor(t * text.length);
      let s = '';
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        s += i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
