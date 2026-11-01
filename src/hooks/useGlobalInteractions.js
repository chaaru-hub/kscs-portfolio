import { useEffect } from 'react';

const MAGNET_STRENGTH = 0.28;

/**
 * One delegated pointer listener powers three effects site-wide:
 *  - [data-tilt="deg"]  3D tilt toward the pointer
 *  - .spotlight         radial glow that follows the pointer (--mx / --my)
 *  - [data-magnetic]    element drifts toward the pointer
 * Disabled for coarse pointers and reduced motion.
 */
export default function useGlobalInteractions(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    let raf = 0;
    let last = null;
    let tiltEl = null;
    let magnetEl = null;

    const resetTilt = (el) => {
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    const resetMagnet = (el) => {
      el.classList.remove('is-magnet');
      el.style.transform = '';
    };

    const frame = () => {
      raf = 0;
      if (!last) return;
      const { x, y, target } = last;
      if (!(target instanceof Element)) return;

      const spot = target.closest('.spotlight');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${x - r.left}px`);
        spot.style.setProperty('--my', `${y - r.top}px`);
      }

      const tilt = target.closest('[data-tilt]');
      if (tilt !== tiltEl) {
        if (tiltEl) resetTilt(tiltEl);
        tiltEl = tilt;
      }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const max = parseFloat(tilt.dataset.tilt) || 6;
        const px = (x - r.left) / r.width - 0.5;
        const py = (y - r.top) / r.height - 0.5;
        tilt.classList.add('is-tilting');
        tilt.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`);
        tilt.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`);
      }

      const magnet = target.closest('[data-magnetic]');
      if (magnet !== magnetEl) {
        if (magnetEl) resetMagnet(magnetEl);
        magnetEl = magnet;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = (x - (r.left + r.width / 2)) * MAGNET_STRENGTH;
        const dy = (y - (r.top + r.height / 2)) * MAGNET_STRENGTH;
        magnet.classList.add('is-magnet');
        magnet.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      }
    };

    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY, target: e.target };
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      if (tiltEl) resetTilt(tiltEl);
      if (magnetEl) resetMagnet(magnetEl);
      tiltEl = magnetEl = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      onLeave();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled]);
}
