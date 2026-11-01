import { useState } from 'react';

// Drop your photo at /public/profile.jpg — falls back to the KS vector avatar.
const PHOTO_SRC = 'profile.jpg';
const FALLBACK_SRC = 'profile-placeholder.svg';

export default function ProfilePhoto({ className = '', alt = 'Karanam Selvakumar Chaaruseelan' }) {
  const [src, setSrc] = useState(PHOTO_SRC);
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      draggable="false"
      loading="eager"
      onError={() => src !== FALLBACK_SRC && setSrc(FALLBACK_SRC)}
    />
  );
}
