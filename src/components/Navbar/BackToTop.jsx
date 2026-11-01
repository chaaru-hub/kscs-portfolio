import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const circleRef = useRef(null);
  const C = 2 * Math.PI * 22;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setVisible(window.scrollY > 600);
        if (circleRef.current) circleRef.current.style.strokeDashoffset = String(C * (1 - p));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [C]);

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r="22" className="track" />
        <circle ref={circleRef} cx="25" cy="25" r="22" className="progress" strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <ArrowUp size={18} />
    </button>
  );
}
