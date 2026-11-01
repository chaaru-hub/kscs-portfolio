import {
  AwsIcon,
  DockerIcon,
  GitIcon,
  JavaScriptIcon,
  MongoIcon,
  NextIcon,
  NodeIcon,
  PostgresIcon,
  ReactIcon,
  RedisIcon,
  TypeScriptIcon,
  ViteIcon,
  ZodIcon,
} from '../components/common/BrandIcons';

/* x / y are percentages inside the matrix canvas; size in px. */
export const MATRIX_SKILLS = [
  { name: 'React', Icon: ReactIcon, level: 90, category: 'Frontend Library', x: 50, y: 46, size: 92, color: '#61DAFB', dur: 5.2 },
  { name: 'TypeScript', Icon: TypeScriptIcon, level: 78, category: 'Typed Language', x: 26, y: 24, size: 70, color: '#3178C6', dur: 4.6 },
  { name: 'Node.js', Icon: NodeIcon, level: 80, category: 'Runtime / Backend', x: 74, y: 22, size: 76, color: '#539E43', dur: 5.8 },
  { name: 'MongoDB', Icon: MongoIcon, level: 72, category: 'NoSQL Database', x: 85, y: 56, size: 66, color: '#47A248', dur: 4.9 },
  { name: 'JavaScript', Icon: JavaScriptIcon, level: 92, category: 'Core Language', x: 18, y: 58, size: 80, color: '#F7DF1E', dur: 6.1 },
  { name: 'Vite', Icon: ViteIcon, level: 85, category: 'Build Tooling', x: 50, y: 12, size: 58, color: '#BD34FE', dur: 4.2 },
  { name: 'PostgreSQL', Icon: PostgresIcon, level: 74, category: 'Relational Database', x: 66, y: 80, size: 68, color: '#336791', dur: 5.5 },
  { name: 'Redis', Icon: RedisIcon, level: 60, category: 'In-memory Store', x: 92, y: 30, size: 52, color: '#DC382D', dur: 4.4 },
  { name: 'Next.js', Icon: NextIcon, level: 70, category: 'React Framework', x: 34, y: 82, size: 64, color: '#FFFFFF', dur: 6.4 },
  { name: 'AWS', Icon: AwsIcon, level: 55, category: 'Cloud Platform', x: 8, y: 32, size: 56, color: '#FF9900', dur: 5.1 },
  { name: 'Git', Icon: GitIcon, level: 88, category: 'Version Control', x: 8, y: 84, size: 54, color: '#F05032', dur: 4.7 },
  { name: 'Docker', Icon: DockerIcon, level: 62, category: 'Containers / DevOps', x: 90, y: 84, size: 58, color: '#2496ED', dur: 5.9 },
  { name: 'Zod', Icon: ZodIcon, level: 68, category: 'Schema Validation', x: 72, y: 50, size: 48, color: '#3068B7', dur: 4.3 },
];

// Edit these to match your real numbers.
export const METRICS = [
  { key: 'repos', label: 'Repositories', value: 3, suffix: '+', detail: 'Projects built & shipped', bars: [3, 5, 4, 7, 6, 9] },
  { key: 'contributions', label: 'Contributions', value: 5, suffix: '+', detail: 'Open-source work', bars: [4, 6, 9, 5, 8, 10] },
  { key: 'hackathons', label: 'Hackathons', value: 3, suffix: '+', detail: 'Hackathons participated', bars: [2, 3, 3, 5, 6, 7] },
  { key: 'frameworks', label: 'Frameworks', value: 10, suffix: '+', detail: 'Across the full stack', bars: [5, 4, 6, 7, 7, 9] },
];
