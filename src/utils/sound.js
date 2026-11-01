// Tiny synthesized UI sounds — no audio files, created lazily on first use.
let ctx = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function playTone({ freq = 660, to = freq, duration = 0.06, volume = 0.05, type = 'sine' } = {}) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export const sounds = {
  click: () => playTone({ freq: 880, to: 620, duration: 0.05, volume: 0.035, type: 'triangle' }),
  open: () => playTone({ freq: 520, to: 980, duration: 0.12, volume: 0.04 }),
  success: () => {
    playTone({ freq: 660, duration: 0.08, volume: 0.04 });
    window.setTimeout(() => playTone({ freq: 990, duration: 0.12, volume: 0.04 }), 70);
  },
};
