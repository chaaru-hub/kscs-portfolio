import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'kscs-settings';
const LEGACY_THEME_KEY = 'kscs-theme';

export const ACCENTS = [
  { id: 'cyber', label: 'Cyber', colors: ['#00E5CC', '#6F00FF'] },
  { id: 'aurora', label: 'Aurora', colors: ['#34D399', '#3B82F6'] },
  { id: 'sunset', label: 'Sunset', colors: ['#FF8A3D', '#FF2E88'] },
  { id: 'plasma', label: 'Plasma', colors: ['#FF4FD8', '#5B5BFF'] },
];

export const DEFAULT_SETTINGS = {
  theme: 'dark', // 'dark' | 'light' | 'system'
  accent: 'cyber',
  motion: 'full', // 'full' | 'reduced'
  cursor: true,
  particles: true,
  sound: false,
  heroVisual: 'globe', // 'globe' | 'orbit'
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    const legacy = localStorage.getItem(LEGACY_THEME_KEY);
    if (legacy === 'light' || legacy === 'dark') return { ...DEFAULT_SETTINGS, theme: legacy };
  } catch {
    /* storage unavailable */
  }
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return { ...DEFAULT_SETTINGS, motion: prefersReduced ? 'reduced' : 'full' };
}

function useSystemTheme() {
  const query = '(prefers-color-scheme: light)';
  const [light, setLight] = useState(() => window.matchMedia?.(query).matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setLight(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return light ? 'light' : 'dark';
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);
  const systemTheme = useSystemTheme();
  const resolvedTheme = settings.theme === 'system' ? systemTheme : settings.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-accent', settings.accent);
    root.setAttribute('data-motion', settings.motion);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable */
    }
  }, [settings, resolvedTheme]);

  const update = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);
  const toggleTheme = useCallback(
    () => setSettings((s) => ({ ...s, theme: (s.theme === 'system' ? systemTheme : s.theme) === 'dark' ? 'light' : 'dark' })),
    [systemTheme],
  );

  const value = useMemo(
    () => ({ settings, resolvedTheme, update, reset, toggleTheme }),
    [settings, resolvedTheme, update, reset, toggleTheme],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
