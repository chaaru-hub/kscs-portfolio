import { useEffect } from 'react';

/** Locks body scroll while `active`, and closes on Escape. */
export default function useScrollLock(active, onEscape) {
  useEffect(() => {
    if (!active) return undefined;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.classList.add('is-locked');
    document.body.style.paddingRight = scrollbar > 0 ? `${scrollbar}px` : '';

    const onKey = (e) => {
      if (e.key === 'Escape') onEscape?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-locked');
      document.body.style.paddingRight = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active, onEscape]);
}
