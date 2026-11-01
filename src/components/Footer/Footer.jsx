import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import './Footer.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">
          KSCS<span>.</span>
        </p>
        <p className="footer__copy mono">
          © {YEAR} Karanam Selvakumar Chaaruseelan · Crafted with React + Vite
        </p>
        <div className="footer__links">
          <a href="https://github.com/chaaru-hub" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GithubIcon size={18} />
          </a>
          <a href="https://www.linkedin.com/in/chaaru-seelan" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
