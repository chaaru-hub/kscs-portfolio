import {
  CppIcon,
  CssIcon,
  DockerIcon,
  FastApiIcon,
  GitIcon,
  HtmlIcon,
  JavaScriptIcon,
  MongoIcon,
  NodeIcon,
  PostgresIcon,
  PythonIcon,
  ReactIcon,
  TypeScriptIcon,
  ViteIcon,
} from '../common/BrandIcons';
import './TechMarquee.css';

const ITEMS = [
  ['React', ReactIcon],
  ['TypeScript', TypeScriptIcon],
  ['JavaScript', JavaScriptIcon],
  ['Python', PythonIcon],
  ['FastAPI', FastApiIcon],
  ['Node.js', NodeIcon],
  ['PostgreSQL', PostgresIcon],
  ['MongoDB', MongoIcon],
  ['Vite', ViteIcon],
  ['Docker', DockerIcon],
  ['Git', GitIcon],
  ['C++', CppIcon],
  ['HTML5', HtmlIcon],
  ['CSS3', CssIcon],
];

/** Infinite, hover-pausable tech ticker between Hero and About. */
export default function TechMarquee() {
  const row = (hidden) =>
    ITEMS.map(([name, Icon]) => (
      <li key={`${name}-${hidden}`} aria-hidden={hidden || undefined}>
        <Icon size={22} />
        <span>{name}</span>
        <i className="marquee__sep" aria-hidden="true">
          ✦
        </i>
      </li>
    ));

  return (
    <div className="marquee" aria-label="Technologies I use">
      <ul className="marquee__track">
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}
