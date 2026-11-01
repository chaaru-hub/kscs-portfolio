import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Crosshair, Mail } from 'lucide-react';
import Reveal from '../common/Reveal';
import ScrambleText from '../common/ScrambleText';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { EMAIL, copyText } from '../../utils/clipboard';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import { sounds } from '../../utils/sound';
import './Contact.css';

const SOCIALS = [
  {
    name: 'LinkedIn',
    handle: 'in/chaaru-seelan',
    href: 'https://www.linkedin.com/in/chaaru-seelan',
    Icon: LinkedinIcon,
    color: '#0a66c2',
    blurb: 'Professional updates, experience & networking.',
  },
  {
    name: 'GitHub',
    handle: 'chaaru-hub',
    href: 'https://github.com/chaaru-hub',
    Icon: GithubIcon,
    color: '#8b5cf6',
    blurb: 'Source code, experiments & open-source work.',
  },
];

const [EMAIL_USER, EMAIL_DOMAIN] = EMAIL.split('@');

export default function Contact() {
  const toast = useToast();
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(EMAIL);
    if (!ok) {
      toast('Could not copy — please copy it manually', { type: 'info' });
      return;
    }
    if (settings.sound) sounds.success();
    toast('Email copied to clipboard');
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="section contact">
      <div className="container contact__wrap">
        <Reveal className="section-head contact__head">
          <p className="section-tag">
            <ScrambleText text="Contact" />
          </p>
          <h2 className="section-title">
            Let&apos;s build something <span className="text-gradient">remarkable</span>.
          </h2>
          <p className="section-sub">
            Internships, collaborations, hackathon teams or just a good tech conversation — my inbox is open.
          </p>
        </Reveal>

        <Reveal className="contact__email glass spotlight">
          <div className="contact__email-top">
            <span className="contact__target" aria-hidden="true">
              <Crosshair size={24} />
            </span>
            <span className="contact__label mono">{'// direct_line'}</span>
            <span className="contact__status mono">
              <span className="contact__pulse" /> Replies within 24–48 h
            </span>
          </div>

          <a className="contact__address" href={`mailto:${EMAIL}`}>
            <span>{EMAIL_USER}</span>
            <span className="contact__at">@</span>
            <span>{EMAIL_DOMAIN}</span>
          </a>

          <div className="contact__email-actions">
            <button
              type="button"
              className={`btn btn-primary contact__copy ${copied ? 'is-copied' : ''}`}
              onClick={onCopy}
              data-magnetic
            >
              <span className="contact__copy-icon">{copied ? <Check size={17} /> : <Copy size={17} />}</span>
              {copied ? 'Copied!' : 'Copy email'}
            </button>
            <a className="btn btn-ghost" href={`mailto:${EMAIL}`} data-magnetic>
              <Mail size={17} /> Send email
            </a>
          </div>
        </Reveal>

        <div className="contact__socials">
          {SOCIALS.map(({ name, handle, href, Icon, color, blurb }, i) => (
            <Reveal key={name} delay={120 + i * 100}>
              <a
                className="social glass spotlight"
                data-tilt="6"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ '--brand': color }}
              >
                <span className="social__icon">
                  <Icon size={26} />
                </span>
                <span className="social__text">
                  <strong>{name}</strong>
                  <span className="mono">{handle}</span>
                  <small>{blurb}</small>
                </span>
                <ArrowUpRight className="social__arrow" size={22} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
