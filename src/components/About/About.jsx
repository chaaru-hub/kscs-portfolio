import { BrainCircuit, Code2, Database, Server } from 'lucide-react';
import Reveal from '../common/Reveal';
import ScrambleText from '../common/ScrambleText';
import ProfileIDCard from './ProfileIDCard';
import './About.css';

const STRENGTHS = [
  {
    Icon: Code2,
    title: 'Frontend',
    text: 'Pixel-precise React interfaces, motion design and component architecture that scales.',
    accent: 'cyan',
  },
  {
    Icon: Server,
    title: 'Backend',
    text: 'REST APIs with FastAPI & Node.js — clean contracts, validation and sensible structure.',
    accent: 'violet',
  },
  {
    Icon: Database,
    title: 'Databases',
    text: 'Relational modelling in SQL/PostgreSQL plus document stores like MongoDB and Redis.',
    accent: 'cyan',
  },
  {
    Icon: BrainCircuit,
    title: 'AI Integration',
    text: 'Wiring LLMs, NLP pipelines and anomaly detection into products people actually use.',
    accent: 'violet',
  },
];

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <div className="about__card-col">
          <ProfileIDCard />
        </div>

        <div className="about__copy">
          <Reveal className="section-head">
            <p className="section-tag">
            <ScrambleText text="About Me" />
          </p>
            <h2 className="section-title">
              Engineering <span className="text-gradient">ideas</span> into living software.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="about__lead">
              I&apos;m <strong>Karanam Selvakumar Chaaruseelan</strong> — KSCS for short — a Computer
              Science Engineering student at SRM Institute of Science and Technology, Ramapuram, Chennai.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <p className="about__text">
              I love the full journey of a product: sketching the interface, designing the API, shaping the
              data and finally weaving in AI where it genuinely helps. My recent work spans disaster-response
              platforms, IoT energy dashboards and civic-tech grievance triage — each one built at hackathon
              speed but with a craftsman&apos;s eye for detail.
            </p>
          </Reveal>

          <div className="about__strengths">
            {STRENGTHS.map(({ Icon, title, text, accent }, i) => (
              <Reveal key={title} delay={240 + i * 90}>
                <div className={`strength strength--${accent} spotlight is-interactive`} data-tilt="8">
                  <span className="strength__icon">
                    <Icon size={22} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
