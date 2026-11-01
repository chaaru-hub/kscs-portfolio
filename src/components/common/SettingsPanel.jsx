import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Check, Globe, Monitor, Moon, Orbit, MousePointer2, RotateCcw, Sparkles, Sun, Volume2, Waves, X } from 'lucide-react';
import { ACCENTS, useSettings } from '../../context/SettingsContext';
import useScrollLock from '../../hooks/useScrollLock';
import { MOD_KEY } from '../../utils/platform';
import './SettingsPanel.css';

function Segmented({ label, value, options, onChange }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map(({ id, label: text, Icon }) => (
        <button
          type="button"
          key={id}
          role="radio"
          aria-checked={value === id}
          className={value === id ? 'is-active' : ''}
          onClick={() => onChange(id)}
        >
          <Icon size={15} />
          {text}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, description, Icon, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span className="toggle-row__icon">
        <Icon size={17} />
      </span>
      <span className="toggle-row__text">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <input type="checkbox" className="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

const SHORTCUTS = [
  [`${MOD_KEY} + K`, 'Command palette'],
  ['/', 'Quick search'],
  ['T', 'Toggle theme'],
  ['S', 'Open settings'],
  ['Esc', 'Close any panel'],
];

export default function SettingsPanel({ open, onClose }) {
  const { settings, update, reset } = useSettings();
  const closeRef = useRef(null);
  useScrollLock(open, onClose);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return createPortal(
    <>
      <div className={`settings-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        className={`settings ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        aria-hidden={!open}
        inert={!open}
      >
        <header className="settings__head">
          <div>
            <p className="mono">{'// preferences'}</p>
            <h2>Settings</h2>
          </div>
          <button type="button" className="settings__close" onClick={onClose} aria-label="Close settings" ref={closeRef}>
            <X size={18} />
          </button>
        </header>

        <div className="settings__body">
          <section>
            <h3>Theme</h3>
            <Segmented
              label="Theme"
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { id: 'dark', label: 'Dark', Icon: Moon },
                { id: 'light', label: 'Light', Icon: Sun },
                { id: 'system', label: 'System', Icon: Monitor },
              ]}
            />
          </section>

          <section>
            <h3>Accent colour</h3>
            <div className="swatches" role="radiogroup" aria-label="Accent colour">
              {ACCENTS.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  role="radio"
                  aria-checked={settings.accent === a.id}
                  className={`swatch ${settings.accent === a.id ? 'is-active' : ''}`}
                  onClick={() => update({ accent: a.id })}
                  style={{ '--s1': a.colors[0], '--s2': a.colors[1] }}
                >
                  <span className="swatch__dot">{settings.accent === a.id && <Check size={16} />}</span>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>Home visual</h3>
            <Segmented
              label="Home visual"
              value={settings.heroVisual}
              onChange={(heroVisual) => update({ heroVisual })}
              options={[
                { id: 'globe', label: '3D globe', Icon: Globe },
                { id: 'orbit', label: 'Orbit', Icon: Orbit },
              ]}
            />
          </section>

          <section>
            <h3>Motion</h3>
            <Segmented
              label="Motion"
              value={settings.motion}
              onChange={(motion) => update({ motion })}
              options={[
                { id: 'full', label: 'Full motion', Icon: Sparkles },
                { id: 'reduced', label: 'Reduced', Icon: Waves },
              ]}
            />
          </section>

          <section>
            <h3>Experience</h3>
            <div className="toggles">
              <Toggle
                label="Custom cursor"
                description="Neon ring cursor with magnetic hover"
                Icon={MousePointer2}
                checked={settings.cursor}
                onChange={(cursor) => update({ cursor })}
              />
              <Toggle
                label="Particle background"
                description="Interactive constellation that follows you"
                Icon={Sparkles}
                checked={settings.particles}
                onChange={(particles) => update({ particles })}
              />
              <Toggle
                label="Interface sounds"
                description="Soft synthesized clicks on interaction"
                Icon={Volume2}
                checked={settings.sound}
                onChange={(sound) => update({ sound })}
              />
            </div>
          </section>

          <section>
            <h3>Keyboard shortcuts</h3>
            <ul className="shortcuts">
              {SHORTCUTS.map(([keys, desc]) => (
                <li key={keys}>
                  <span>{desc}</span>
                  <kbd>{keys}</kbd>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="settings__foot">
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            <RotateCcw size={14} /> Reset to defaults
          </button>
        </footer>
      </aside>
    </>,
    document.body,
  );
}
