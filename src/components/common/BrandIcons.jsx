/* Lightweight, stylised inline brand marks (24×24 viewBox). */
import { useId } from 'react';

const base = (size, props) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: 'false',
  ...props,
});

export const ReactIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)} fill="none" stroke="#61DAFB" strokeWidth="1.1">
    <circle cx="12" cy="12" r="2" fill="#61DAFB" stroke="none" />
    <ellipse cx="12" cy="12" rx="10" ry="3.9" />
    <ellipse cx="12" cy="12" rx="10" ry="3.9" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="3.9" transform="rotate(120 12 12)" />
  </svg>
);

export const JavaScriptIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <rect width="24" height="24" rx="3" fill="#F7DF1E" />
    <path
      d="M7.4 19.3l1.6-1c.3.6.6 1 1.2 1 .6 0 1-.2 1-1.2V11h2v7.2c0 2-1.2 2.9-2.9 2.9-1.5 0-2.4-.8-2.9-1.8zm7.1-.2l1.6-1c.4.7 1 1.2 1.9 1.2.8 0 1.3-.4 1.3-1 0-.7-.5-.9-1.4-1.3l-.5-.2c-1.4-.6-2.3-1.3-2.3-2.9 0-1.4 1.1-2.5 2.8-2.5 1.2 0 2.1.4 2.7 1.5l-1.5 1c-.3-.6-.7-.8-1.2-.8-.6 0-.9.4-.9.8 0 .6.4.8 1.2 1.2l.5.2c1.6.7 2.6 1.4 2.6 3 0 1.8-1.4 2.7-3.2 2.7-1.8 0-3-.9-3.6-2z"
      fill="#1a1a1a"
    />
  </svg>
);

export const TypeScriptIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <rect width="24" height="24" rx="3" fill="#3178C6" />
    <path d="M5 12.2h6.3v1.7H9.1V20H7.2v-6.1H5zm8.6 6.9l1.1-1.4c.6.6 1.5 1 2.3 1 .7 0 1.1-.3 1.1-.8s-.4-.7-1.3-1.1l-.6-.2c-1.3-.5-2.2-1.2-2.2-2.6 0-1.4 1.2-2.4 2.9-2.4 1 0 2 .3 2.7 1l-1 1.4c-.5-.4-1.1-.7-1.7-.7-.6 0-1 .3-1 .7 0 .5.5.7 1.3 1l.6.2c1.4.6 2.2 1.3 2.2 2.6 0 1.5-1.2 2.6-3.2 2.6-1.2 0-2.4-.4-3.2-1.3z" fill="#fff" />
  </svg>
);

export const PythonIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M11.9 2C6.8 2 7.1 4.2 7.1 4.2v2.3H12v.7H5.2S2 6.8 2 12s2.8 5 2.8 5h1.7v-2.4s-.1-2.8 2.8-2.8h4.8s2.7 0 2.7-2.6V4.8S17.2 2 11.9 2zM9.2 3.6a.9.9 0 110 1.8.9.9 0 010-1.8z" fill="#3776AB" />
    <path d="M12.1 22c5.1 0 4.8-2.2 4.8-2.2v-2.3H12v-.7h6.8S22 17.2 22 12s-2.8-5-2.8-5h-1.7v2.4s.1 2.8-2.8 2.8H9.9s-2.7 0-2.7 2.6v4.4S6.8 22 12.1 22zm2.7-1.6a.9.9 0 110-1.8.9.9 0 010 1.8z" fill="#FFD43B" />
  </svg>
);

export const HtmlIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 2l1.6 18L12 22l7.4-2L21 2z" fill="#E34F26" />
    <path d="M12 4v16.2l6-1.6L19.3 4z" fill="#EF652A" />
    <path d="M7.4 7.5h9.2l-.2 2H9.6l.2 2.4h6.4l-.5 5.4L12 18.3l-3.7-1-.3-2.8h2l.1 1.4 1.9.5 1.9-.5.2-2.4H8.1z" fill="#fff" />
  </svg>
);

export const CssIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 2l1.6 18L12 22l7.4-2L21 2z" fill="#1572B6" />
    <path d="M12 4v16.2l6-1.6L19.3 4z" fill="#33A9DC" />
    <path d="M7.4 7.5h9.2l-.2 2H9.6l.2 2.4h6.4l-.5 5.4L12 18.3l-3.7-1-.3-2.8h2l.1 1.4 1.9.5 1.9-.5.2-2.4H8.1z" fill="#fff" />
  </svg>
);

export const ViteIcon = ({ size = 24, ...p }) => {
  const id = useId().replace(/[^\w-]/g, '');
  return (
  <svg {...base(size, p)}>
    <defs>
      <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#41D1FF" />
        <stop offset="1" stopColor="#BD34FE" />
      </linearGradient>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFEA83" />
        <stop offset="1" stopColor="#FFA800" />
      </linearGradient>
    </defs>
    <path d="M22.5 3.6L12.6 21.3c-.2.4-.8.4-1 0L1.5 3.6c-.2-.4.1-.9.6-.8l9.9 1.8h.2l9.7-1.8c.5-.1.8.4.6.8z" fill={`url(#${id}a)`} />
    <path d="M16.6 1.8L9.3 3.2c-.1 0-.2.1-.2.3l-.5 7.6c0 .2.2.3.3.3l2-.5c.2 0 .3.1.3.3l-.6 2.9c0 .2.2.3.3.3l1.2-.4c.2 0 .3.1.3.3l-.9 4.5c-.1.3.3.4.4.2l.1-.2 4.6-9.3c.1-.2-.1-.4-.3-.3l-2.1.4c-.2 0-.3-.1-.3-.3l1.4-4.8c0-.2-.1-.4-.3-.3z" fill={`url(#${id}b)`} />
  </svg>
  );
};

export const CppIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 1.5l9.5 5.5v11L12 23.5 2.5 18V7z" fill="#00599C" />
    <path d="M12 1.5l9.5 5.5L12 12.5z" fill="#004482" />
    <path d="M12.6 15.6a3.6 3.6 0 01-4.2-3.6 3.6 3.6 0 016.7-1.8l1.8-1A5.6 5.6 0 006.4 12a5.6 5.6 0 0010.5 2.8l-1.8-1a3.6 3.6 0 01-2.5 1.8z" fill="#fff" />
    <path d="M17.2 11.4h.8v-.8h.6v.8h.8v.6h-.8v.8H18V12h-.8zm2.4 0h.8v-.8h.6v.8h.8v.6H21v.8h-.6V12h-.8z" fill="#fff" />
  </svg>
);

export const SqlIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)} fill="none" stroke="#4FB3FF" strokeWidth="1.6">
    <ellipse cx="12" cy="5.5" rx="8" ry="3" fill="rgba(79,179,255,.18)" />
    <path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    <path d="M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>
);

export const NodeIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 1.6l9 5.2v10.4l-9 5.2-9-5.2V6.8z" fill="#539E43" />
    <path d="M12.3 17.2c-2.6 0-3.3-1.2-3.3-2.3h1.4c.1.7.4 1.1 1.9 1.1 1.2 0 1.7-.3 1.7-.9s-.3-.8-2-1c-2-.2-3-.7-3-2.2 0-1.4 1.1-2.2 3.1-2.2 2.2 0 3.1.7 3.2 2.2h-1.4c-.1-.7-.6-1-1.8-1-1.1 0-1.6.3-1.6.8 0 .6.3.7 1.9.9 2.1.3 3.1.7 3.1 2.2s-1.2 2.4-3.2 2.4z" fill="#fff" />
  </svg>
);

export const MongoIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12.3 1.5c-.2-.4-.3-.5-.3-.5s-.1.1-.3.5C9.6 4.4 5.7 7.8 5.7 13c0 4.6 3.3 7.4 5.5 8.6l.4 1.9h.8l.4-1.9c2.2-1.2 5.5-4 5.5-8.6 0-5.2-3.9-8.6-6-11.5z" fill="#47A248" />
    <path d="M12 3v18.5" stroke="#B8C4C2" strokeWidth=".7" />
  </svg>
);

export const PostgresIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)} fill="none" stroke="#fff" strokeWidth=".9">
    <path d="M17.6 15.4c-1.6.3-2.4 0-2.7-.4 2.6-3.9 3.7-8.9 2.7-10.1-2.6-3.4-7.2-1.8-7.3-1.7h-.1a7.7 7.7 0 00-1.6-.2C7.5 3 6.6 3.3 6 3.8 4.6 3.3-.7 1.6 1.6 8.7c.6 1.7 2.1 7.4 4.6 5.5.8.9 1.9 1.4 2 1.4.1.7.2 1.4.3 2 .4 2 1.4 3.4 3.7 3 1.7-.4 2.4-1.5 2.6-3.8.3-1 .1-1.6.3-2.3 1 .5 2.6.6 3.5.2 1.6-.7 1-1.9-1-1.3z" fill="#336791" />
    <path d="M10.4 3.1c.5-.1 4.6-1.6 7 1.8M6 3.8c.4-.3 2.4-1 5 3M12.4 17.6c-.1 1.3.3 2.8 1.5 2.6" />
    <circle cx="8.4" cy="8.2" r=".5" fill="#fff" />
  </svg>
);

export const RedisIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M22 14.5c0 .6-4.4 2.5-6.6 3.6s-3.4 1-5.1.2S2.6 15.3 2 15c-.3-.2-.5-.3-.5-.5v2c0 .2.2.3.5.5.6.3 6.8 2.8 8.3 3.5s2.9.8 5.1-.2 6.6-3 6.6-3.6v-2z" fill="#A41E11" />
    <path d="M22 11c0 .6-4.4 2.5-6.6 3.6s-3.4 1-5.1.2S2.6 11.8 2 11.5c-.3-.2-.5-.3-.5-.5v2c0 .2.2.3.5.5.6.3 6.8 2.8 8.3 3.5s2.9.8 5.1-.2 6.6-3 6.6-3.6v-2z" fill="#C6302B" />
    <path d="M22 7.5c0-.6-4.4-2.5-6.6-3.6s-3.4-1-5.1-.2S2.6 6.6 2 6.9c-.6.3-.6.5 0 .8.6.3 6.8 2.8 8.3 3.5s2.9.8 5.1-.2S22 8.1 22 7.5z" fill="#DC382D" />
    <path d="M13.2 6.2l-1.6.3-.5 1.3-.4-1.3-1.8-.2 1.3-.5-.4-1 1.2.5 1.2-.4-.3.8zM9 8.3l3.5-.6-1.1 1.6z" fill="#fff" />
  </svg>
);

export const NextIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="11" fill="#000" stroke="#fff" strokeWidth=".8" />
    <path d="M9 7.5v9M9 7.5l7.6 10.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M15.4 7.5v5.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const AwsIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <text x="12" y="13" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8.5" fill="#FF9900">aws</text>
    <path d="M4 16c4.6 3 11.6 3 16 0" stroke="#FF9900" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M18 14.8l2.3 1-1 2.2" stroke="#FF9900" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

export const GitIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M22.6 11L13 1.4a1.4 1.4 0 00-2 0l-2 2 2.5 2.5a1.7 1.7 0 012.2 2.2l2.4 2.4a1.7 1.7 0 11-1 1l-2.3-2.3v5.9a1.7 1.7 0 11-1.4 0V9.2a1.7 1.7 0 01-.9-2.3L8 4.4 1.4 11a1.4 1.4 0 000 2l9.6 9.6a1.4 1.4 0 002 0l9.6-9.6a1.4 1.4 0 000-2z" fill="#F05032" />
  </svg>
);

export const DockerIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M23 10.4c-.6-.4-1.9-.6-2.9-.4-.1-1-.7-1.9-1.7-2.6l-.5-.4-.4.5c-.5.8-.7 2-.6 2.9 0 .3.1.9.5 1.4-.4.2-1 .4-1.9.4H.7l-.1.5c-.1 1.8.2 3.6 1.2 5 1 1.3 2.6 2 4.8 2 4.6 0 8-2.1 9.6-6.6.6 0 2 0 2.8-1.4l.2-.4zM2.9 11H5V9H2.9zm2.7 0h2V9h-2zm2.7 0h2V9h-2zm2.7 0h2V9H11zm2.7 0h2V9h-2zM5.6 8.4h2v-2h-2zm2.7 0h2v-2h-2zm2.7 0h2v-2H11zm0-2.6h2v-2H11z" fill="#2496ED" />
  </svg>
);

export const ZodIcon = ({ size = 24, ...p }) => {
  const id = useId().replace(/[^\w-]/g, '');
  return (
  <svg {...base(size, p)}>
    <defs>
      <linearGradient id={`${id}z`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3068B7" />
        <stop offset="1" stopColor="#274D82" />
      </linearGradient>
    </defs>
    <path d="M5.5 3h13l3.5 4.3L12 21 2 7.3z" fill={`url(#${id}z)`} />
    <path d="M7.4 7.2h9.2l-6.4 7.4h6.2" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
  );
};

export const FastApiIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="11" fill="#009688" />
    <path d="M13 4l-6 9.2h4.6L10.5 20l6.2-9.6h-4.7z" fill="#fff" />
  </svg>
);

export const GithubIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)} fill="currentColor">
    <path d="M12 .5A11.5 11.5 0 00.5 12a11.5 11.5 0 007.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 015.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0023.5 12 11.5 11.5 0 0012 .5z" />
  </svg>
);

export const LinkedinIcon = ({ size = 24, ...p }) => (
  <svg {...base(size, p)} fill="currentColor">
    <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2.1 2.1 0 110-4.1 2.1 2.1 0 010 4.1zM7.1 20.5H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" />
  </svg>
);
