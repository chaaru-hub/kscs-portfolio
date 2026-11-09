import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  Award,
  Code2,
  Copy,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Home,
  Mail,
  Moon,
  Search,
  Settings2,
  Sparkles,
  User,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PROJECTS } from '../../data/projectsData';
import { EMAIL, copyText } from '../../utils/clipboard';
import { openResume } from '../../data/resumeData';
import useScrollLock from '../../hooks/useScrollLock';
import { MOD_KEY } from '../../utils/platform';
import './CommandPalette.css';

function openLink(href) {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.click();
}

const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function CommandPalette({ open, onClose, ...rest }) {
  useScrollLock(open, onClose);
  // Mounting the body only while open gives every session a fresh query + selection.
  return open ? <PaletteBody onClose={onClose} {...rest} /> : null;
}

function PaletteBody({ onClose, onOpenSettings, onToggleTheme, toast }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const commands = useMemo(
    () => [
      { group: 'Navigate', label: 'Home', hint: 'Hero', Icon: Home, run: () => goTo('home') },
      { group: 'Navigate', label: 'About me', hint: 'ID card', Icon: User, run: () => goTo('about') },
      { group: 'Navigate', label: 'Skills', hint: 'Tech matrix', Icon: Sparkles, run: () => goTo('skills') },
      { group: 'Navigate', label: 'Projects', hint: 'Live projects', Icon: FolderGit2, run: () => goTo('projects') },
      { group: 'Navigate', label: 'Credentials', hint: 'Hackathons', Icon: Award, run: () => goTo('certifications') },
      { group: 'Navigate', label: 'Contact', hint: 'Say hello', Icon: Mail, run: () => goTo('contact') },
      ...PROJECTS.map((p) => ({
        group: 'Projects',
        label: p.live ? `Visit ${p.title}` : `${p.title} (link coming soon)`,
        hint: p.category,
        Icon: Code2,
        run: () => (p.live ? openLink(p.live) : goTo('projects')),
      })),
      { group: 'Actions', label: 'View resume', hint: 'PDF · download', Icon: FileText, run: openResume },
      {
        group: 'Actions',
        label: 'Copy email address',
        hint: EMAIL,
        Icon: Copy,
        run: async () => (await copyText(EMAIL)) && toast('Email copied to clipboard'),
      },
      { group: 'Actions', label: 'Toggle dark / light', hint: 'T', Icon: Moon, run: onToggleTheme },
      { group: 'Actions', label: 'Open settings', hint: 'S', Icon: Settings2, run: onOpenSettings },
      {
        group: 'Links',
        label: 'GitHub — chaaru-hub',
        hint: 'github.com',
        Icon: GithubIcon,
        run: () => openLink('https://github.com/chaaru-hub'),
      },
      {
        group: 'Links',
        label: 'LinkedIn — chaaru-seelan',
        hint: 'linkedin.com',
        Icon: LinkedinIcon,
        run: () => openLink('https://www.linkedin.com/in/chaaru-seelan'),
      },
    ],
    [onOpenSettings, onToggleTheme, toast],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label} ${c.hint}`.toLowerCase().includes(q));
  }, [commands, query]);

  const select = (i) => {
    setIndex(i);
    requestAnimationFrame(() =>
      listRef.current?.querySelector(`#cmdk-item-${i}`)?.scrollIntoView({ block: 'nearest' }),
    );
  };

  const run = (cmd) => {
    if (!cmd) return;
    onClose();
    // let the overlay close before scrolling / opening anything
    window.setTimeout(() => cmd.run(), 60);
  };

  const onKeyDown = (e) => {
    const n = Math.max(filtered.length, 1);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      select((index + 1) % n);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      select((index - 1 + n) % n);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(filtered[index]);
    }
  };

  let lastGroup = null;

  return createPortal(
    <div className="cmdk" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmdk__panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="cmdk__search">
          <Search size={18} />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search sections, projects, actions…"
            aria-label="Search commands"
            aria-controls="cmdk-list"
            aria-activedescendant={filtered[index] ? `cmdk-item-${index}` : undefined}
            role="combobox"
            aria-expanded="true"
          />
          <kbd>Esc</kbd>
        </div>

        <div className="cmdk__list" id="cmdk-list" role="listbox" ref={listRef}>
          {filtered.length === 0 && <p className="cmdk__empty">No results for “{query}”</p>}
          {filtered.map((cmd, i) => {
            const header = cmd.group !== lastGroup ? cmd.group : null;
            lastGroup = cmd.group;
            const { Icon } = cmd;
            return (
              <div key={cmd.label} role="presentation">
                {header && <p className="cmdk__group mono">{header}</p>}
                <button
                  type="button"
                  id={`cmdk-item-${i}`}
                  role="option"
                  aria-selected={i === index}
                  className={`cmdk__item ${i === index ? 'is-selected' : ''}`}
                  onMouseMove={() => i !== index && setIndex(i)}
                  onClick={() => run(cmd)}
                  tabIndex={-1}
                >
                  <span className="cmdk__icon">
                    <Icon size={16} />
                  </span>
                  <span className="cmdk__label">{cmd.label}</span>
                  <span className="cmdk__hint mono">{cmd.hint}</span>
                  <ArrowRight size={15} className="cmdk__go" />
                </button>
              </div>
            );
          })}
        </div>

        <footer className="cmdk__foot mono">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>
              <CornerDownLeft size={11} />
            </kbd>{' '}
            select
          </span>
          <span>
            <kbd>{MOD_KEY}</kbd>
            <kbd>K</kbd> toggle
          </span>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
